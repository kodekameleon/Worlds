/*
 * Derived from work by Lubos Brieda and Jaco Stuifbergen
 *
 * See the following sites for original work
 *
 * https://www.particleincell.com/2012/bezier-splines/
 * http://www.jacos.nl/jacos_html/spline/index.html
 * http://www.jacos.nl/jacos_html/spline/circular/index.html
 */

const MIN_WEIGHT = 1; // the calculation of a curve becomes impossible if a distance is 0

export function openSpline(points) {
  /* grab (x,y) coordinates of the knots */
  const x = [];
  const y = [];
  for (let i = 0; i < points.length; i++) {
    x[i] = points[i][0];
    y[i] = points[i][1];
  }

  // Weights equal to the distances between knots. If knots are nearer, the 3rd derivative can be higher
  const weights = [];
  for (let i = 0; i < points.length - 1; i++) {
    /* Calculate Euclidean distance */
    weights[i] = Math.sqrt(Math.pow((x[i + 1] - x[i]), 2) + Math.pow((y[i + 1] - y[i]), 2));

    // If the weight is too small, the calculation becomes instable
    if (weights[i] < MIN_WEIGHT) {
      weights[i] = MIN_WEIGHT;
    }
  }
  weights[points.length - 1] = weights[points.length - 2];

  /* berekenen van de curve */
  const px = computeControlPointsBigWThomas(x, weights);
  const py = computeControlPointsBigWThomas(y, weights);

  return {px, py};
}


/*computes spline control points*/
export function closedSpline(points) {
  /*grab (x,y) coordinates of the knots */
  const x = [];
  const y = [];
  for (let i = 0; i < points.length; i++) {
    x[i] = points[i][0];
    y[i] = points[i][1];
  }

  // Weights equal to the distances between knots. If knots are nearer, the 3rd derivative can be higher
  function weighting(x1, x2, y1, y2) {
    /* Calculate Euclidean distance */
    const d = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    // If the weight is too small, the calculation becomes instable
    return d < MIN_WEIGHT ? MIN_WEIGHT : d;
  }

  const weights = [];
  for (let i = 0; i < points.length - 1; i++) {
    weights[i] = weighting(x[i + 1], x[i], y[i + 1], y[i]);
  }
  weights[points.length - 1] = weighting(x[0], x[points.length - 1], y[0], y[points.length - 1]);

  const px = computeControlPointsCircularW(x, weights);
  const py = computeControlPointsCircularW(y, weights);

  return {px, py};
}


/*
 * computes control points given knots K, this is the brain of the operation
*/
function computeControlPointsBigWThomas(K, W) {
  const n = K.length - 1;

  /*rhs vector*/
  const a = [];
  const b = [];
  const c = [];
  const d = [];
  const r = [];

  /*left most segment*/
  a[0] = 0; // outside the matrix
  b[0] = 2;
  c[0] = -1;
  d[0] = 0;
  r[0] = K[0] + 0;// add curvature at K0

  /*internal segments*/
  for (let i = 1; i < n; i++) {
    a[2 * i - 1] = 1 * W[i] * W[i];
    b[2 * i - 1] = -2 * W[i] * W[i];
    c[2 * i - 1] = 2 * W[i - 1] * W[i - 1];
    d[2 * i - 1] = -1 * W[i - 1] * W[i - 1];
    r[2 * i - 1] = K[i] * ((-W[i] * W[i] + W[i - 1] * W[i - 1]));

    a[2 * i] = W[i];
    b[2 * i] = W[i - 1];
    c[2 * i] = 0;
    d[2 * i] = 0; // note: d[2n-2] is already outside the matrix
    r[2 * i] = (W[i - 1] + W[i]) * K[i];
  }

  /*right segment*/
  a[2 * n - 1] = -1;
  b[2 * n - 1] = 2;
  r[2 * n - 1] = K[n];// curvature at last point

  // the following array elements are not in the original matrix, so they should not be used:
  c[2 * n - 1] = 0; // outside the matrix
  d[2 * n - 2] = 0; // outside the matrix
  d[2 * n - 1] = 0; // outside the matrix

  /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
  const p = Thomas4(r, a, b, c, d);

  /*re-arrange the array*/
  const p1 = [];
  const p2 = [];
  for (let i = 0; i < n; i++) {
    p1[i] = p[2 * i];
    p2[i] = p[2 * i + 1];
  }

  return {p1, p2};
}

function Thomas4(r, a, b, c, d) {
  const n = r.length;
  const p = new Array(n);

  // the following array elements are not in the original matrix, so they should not have an effect
  a[0] = 0; // outside the matrix
  c[n - 1] = 0; // outside the matrix
  d[n - 2] = 0; // outside the matrix
  d[n - 1] = 0; // outside the matrix

  /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
  /* adapted for a 4-diagonal matrix. only the a[i] are under the diagonal, so the Gaussian elimination is very similar */
  for (let i = 1; i < n; i++) {
    const m = a[i] / b[i - 1];
    b[i] = b[i] - m * c[i - 1];
    c[i] = c[i] - m * d[i - 1];
    r[i] = r[i] - m * r[i - 1];
  }

  p[n - 1] = r[n - 1] / b[n - 1];
  p[n - 2] = (r[n - 2] - c[n - 2] * p[n - 1]) / b[n - 2];
  for (let i = n - 3; i >= 0; --i) {
    p[i] = (r[i] - c[i] * p[i + 1] - d[i] * p[i + 2]) / b[i];
  }
  return p;
}

/*
 * computes control points given knots K, this is the brain of the operation
 */
function computeControlPointsCircularW(k, w) {
  const n = k.length;

  /*rhs vector*/
  const a = [];
  const b = [];
  const c = [];
  const r = [];

  /*internal segments: required: W[n] exists, the same length as K*/
  const K = k.slice();
  const W = w.slice();
  W[-1] = W[n - 1];
  W[n] = W[0];
  K[n] = K[0];
  for (let i = 0; i < n; i++) {
    const frac_i = W[i] / W[i + 1];
    a[i] = 1 * W[i] * W[i];
    b[i] = 2 * W[i - 1] * (W[i - 1] + W[i]);
    c[i] = W[i - 1] * W[i - 1] * frac_i;
    r[i] = Math.pow(W[i - 1] + W[i], 2) * K[i] + Math.pow(W[i - 1], 2) * (1 + frac_i) * K[i + 1];
  }

  const p1 = ThomasCircular(r, a, b, c);

  /*we have p1, now compute p2: required: p1[n] exists*/
  const p2 = [];
  p1[n] = p1[0];
  for (let i = 0; i < n; i++) {
    p2[i] = K[i + 1] * (1 + W[i] / W[i + 1]) - p1[i + 1] * (W[i] / W[i + 1]);
  }

  return {p1, p2};
}

function ThomasCircular(r, a, b, c) {
  const n = r.length;

  const lc = [];
  lc[0] = a[0];

  let lr = c[n - 1];
  let i;
  for (i = 0; i < n - 3; i++) {
    let m = a[i + 1] / b[i];
    b[i + 1] -= m * c[i];
    r[i + 1] -= m * r[i];
    lc[i + 1] = -m * lc[i];

    m = lr / b[i];
    b[n - 1] -= m * lc[i];
    lr = -m * c[i];
    r[n - 1] -= m * r[i];
  }

  let m = a[i + 1] / b[i];
  b[i + 1] -= m * c[i];
  r[i + 1] -= m * r[i];
  c[i + 1] -= m * lc [i];
  m = lr / b[i];
  b[n - 1] -= m * lc[i];
  a[n - 1] -= m * c[i];
  r[n - 1] = r[n - 1] - m * r[i];

  m = a[n - 1] / b[n - 2];
  b[n - 1] -= m * c[n - 2];
  r[n - 1] -= m * r[n - 2];

  const x = [];
  x[n - 1] = r[n - 1] / b[n - 1];
  lc[n - 2] = 0;
  for (i = n - 2; i >= 0; --i) {
    x[i] = (r[i] - c[i] * x[i + 1] - lc[i] * x[n - 1]) / b[i];
  }
  return x;
}

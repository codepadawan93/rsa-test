/**
 *
 * Select p=5 & q=11 prime numbers (keep secrets)
 * Calculate n=p*q = 55 (public)
 * Calculate (n)= (p-1)*(q-1)=4*10=40 (keep secrets)
 * Select integer e=3 (public)
 * Calculate d (secret), e*d=1 mod (n),
 *
 */
const app = {};
app.phi = (p, q) => (p - 1) * (q - 1);
app.modinv = (a, b) => {
  a %= b;
  for (var x = 1; x < b; x++) {
    if ((a * x) % b == 1) {
      return x;
    }
  }
};
const p = 5;
const q = 11;
const n = p * q;
const phi = app.phi(p, q);
const e = 3;
const d = app.modinv(e, phi);
const priv = [e, n];
const pub = [d, n];
console.log(phi);
console.log(priv);
console.log(pub);

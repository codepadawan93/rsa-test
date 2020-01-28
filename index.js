/**
 *
 * Select p=5 & q=11 prime numbers (keep secrets)
 * Calculate n=p*q = 55 (public)
 * Calculate phi(n)= (p-1)*(q-1)=4*10=40 (keep secrets)
 * Select integer e=3 (public)
 * Calculate d (secret), e*d=1 mod phi(n),
 *
 */
function RSA() {
  let _pub = null;
  let _priv = null;

  const _phi = (p, q) => (p - 1) * (q - 1);

  const _modinv = (a, b) => {
    a %= b;
    for (let x = 1; x < b; x++) {
      if ((a * x) % b == 1) {
        return x;
      }
    }
  };

  this.getKeys = () => {
    if (!_pub && !_priv) {
      throw new Error(
        "Must call RSA.generateKeys() before attempting to get them!"
      );
    }
    return { pub: _pub, priv: _priv };
  };

  this.generateKeys = (p, q) => {
    const n = p * q;
    const phi = _phi(p, q);
    const e = 3;
    const d = _modinv(e, phi);
    _pub = [e, n];
    _priv = [d, n];
  };

  this.encrypt = (plain, key) => {
    plain = Buffer.from(plain).toString("base64");
    plain = plain.split("");
    const cypher = plain.map((char, index) => {
      const number = char.charCodeAt(0);
      console.log("num1=", number);
      const enc = Math.pow(number, key[0]) % key[1];
      console.log("enc=", enc);
      return enc.toString();
    });
    return cypher;
  };
  this.decrypt = (cypher, key) => {
    let plain = cypher.map((hex, index) => {
      const number = parseInt(hex);
      console.log("num2=", number);
      const dec = Math.pow(number, key[0]) % key[1];
      console.log("dec=", dec);
      return String.fromCharCode(dec);
    });
    return Buffer.from(plain.join("")).toString("utf8");
  };
}

const rsa = new RSA();
rsa.generateKeys(5, 11);
const keys = rsa.getKeys();
const encrypted = rsa.encrypt("Test text", keys.pub);
const decrypted = rsa.decrypt(encrypted, keys.priv);
console.log(keys);
console.log(encrypted);
console.log(decrypted);

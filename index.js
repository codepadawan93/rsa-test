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

  const _gcd = (a, b) => {
    // Everything divides 0
    if (a == 0) return b;
    if (b == 0) return a;

    // base case
    if (a == b) return a;

    // a is greater
    if (a > b) {
      return _gcd(a - b, b);
    } else {
      return _gcd(a, b - a);
    }
  };

  const _areCoprime = (a, b) => _gcd(a, b) === 1;

  const _getE = (n, phi) => {
    for (let e = 3; e < phi; e += 2) {
      if (_areCoprime(e, phi) && _areCoprime(e, n)) {
        return e;
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
    const e = _getE(n, phi);
    const d = _modinv(e, phi);
    _pub = [e, n];
    _priv = [d, n];
  };

  this.encrypt = (plain, key) => {
    //plain = Buffer.from(plain).toString("base64");
    plain = plain.split("");
    const cypher = plain.map((char, index) => {
      const number = char.charCodeAt(0);
      const enc = Math.pow(number, key[0]) % key[1];
      return enc;
    });
    return cypher;
  };
  this.decrypt = (cypher, key) => {
    let plain = cypher.map((hex, index) => {
      const number = hex;
      const dec = Math.pow(number, key[0]) % key[1];
      return String.fromCharCode(dec);
    });
    return plain.join(""); //Buffer.from(plain.join("")).toString("utf8");
  };
}

const rsa = new RSA();
rsa.generateKeys(2, 7);
const keys = rsa.getKeys();
const encrypted = rsa.encrypt("Test", keys.pub);
const decrypted = rsa.decrypt(encrypted, keys.priv);
console.log(keys);
console.log(encrypted);
console.log(`[${decrypted}]`);

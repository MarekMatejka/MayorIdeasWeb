var passPhrase = 'the slow orange squirrel jumps over the old black cat';
var salt = "3FF2EC019C627B945225DEBAAEC141B6985FE84C95A70EB132882F88C0A59A55";
var iv = 'F27D5C9927726BAB407510B1BDD3D137';

var AesUtil = function() {
  this.keySize = 128 / 32;
  this.iterationCount = 1000;
};

AesUtil.prototype.generateKey = function() {
  var key = CryptoJS.PBKDF2(
      passPhrase, 
      CryptoJS.enc.Hex.parse(salt),
      { keySize: this.keySize, iterations: this.iterationCount });
  return key;
};

AesUtil.prototype.encrypt = function(plainText) {
  var key = this.generateKey();
  var encrypted = CryptoJS.AES.encrypt(
      plainText,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

AesUtil.prototype.decrypt = function(cipherText) {
  var key = this.generateKey(salt, passPhrase);
  // var cipherParams = CryptoJS.lib.CipherParams.create({
  //   ciphertext: CryptoJS.enc.Base64.parse(cipherText)
  // });
  var decrypted = CryptoJS.AES.decrypt(
      cipherText,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
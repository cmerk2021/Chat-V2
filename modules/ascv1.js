const CryptoJS = require("crypto-js")

function encode(text) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let encodedText = '';
  
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      const index = alphabet.indexOf(char);
  
      if (index !== -1) {
        const shift = index + i + 1; // Shift by index + position
        const newIndex = (shift % 26);
        encodedText += alphabet[newIndex];
      } else {
        encodedText += char; // Non-alphabetic characters remain unchanged
      }
    }
  
    return encodedText;
  }
  
  function decode(encodedText) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let decodedText = '';
  
    for (let i = 0; i < encodedText.length; i++) {
      const char = encodedText[i].toLowerCase();
      const index = alphabet.indexOf(char);
  
      if (index !== -1) {
        const shift = index - i - 1; // Reverse the shift
        const newIndex = (shift + 26) % 26; // Ensure positive index
        decodedText += alphabet[newIndex];
      } else {
        decodedText += char; // Non-alphabetic characters remain unchanged
      }
    }
  
    return decodedText;
  }

// ---------------------

function encodeBase64(text, key) {
    // Convert the text to a Uint8Array
    const textBytes = new TextEncoder().encode(text);
  
    // XOR the text bytes with the key
    for (let i = 0; i < textBytes.length; i++) {
      textBytes[i] ^= key;
    }
  
    // Encode the XORed bytes to base64
    const encodedText = btoa(String.fromCharCode(...textBytes));
  
    return encodedText;
  }
  
  function decodeBase64(encodedText, key) {
    // Decode the Base64 string to a Uint8Array
    const decodedBytes = new TextEncoder().encode(atob(encodedText));
  
    // XOR the decoded bytes with the key
    for (let i = 0; i < decodedBytes.length; i++) {
      decodedBytes[i] ^= key;
    }
  
    // Convert the XORed bytes to a string
    const decodedText = new TextDecoder().decode(decodedBytes);
  
    return decodedText;
  }

  function aesEncrypt(string, key) {
    const cryptoKey = CryptoJS.enc.Utf8.parse(key.toString());
    const iv = CryptoJS.enc.Utf8.parse("0123456789abcdef"); // Default IV
    const encrypted = CryptoJS.AES.encrypt(string, cryptoKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }
  
  function aesDecrypt(encryptedString, key) {
    const cryptoKey = CryptoJS.enc.Utf8.parse(key.toString());
    const iv = CryptoJS.enc.Utf8.parse("0123456789abcdef"); // Default IV
    const decrypted = CryptoJS.AES.decrypt(encryptedString, cryptoKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  function asc(text, key) {
    let encodedText = text
    encodedText = encode(encodedText)
    encodedText = encodeBase64(encodedText, key)
    encodedText = aesEncrypt(encodedText, key)
    return encodedText
  }

  function asc_decode(text, key) {
    let decodedText = text
    decodedText = aesDecrypt(decodedText, key)
    decodedText = decodeBase64(decodedText, key)
    decodedText = decode(decodedText)
    return decodedText
  }
 let key = 28
//   let encoded = asc("Hello, world!", key)
//   console.log(encoded)
  let decoded = asc_decode("8krL6P6oergryLsXkUL7C1eG1oEgxGbSI/hk5UnViT4=", 28)
  console.log(decoded)



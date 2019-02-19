function copyUint8Array(e) {
    var a = new Uint8Array(e.length),
        el = e.length;
    for (let i = 0; i < el; i++) {
        a[i] = e[i];
    }
    return a;
}

// export {
//     copyUint8Array
// };
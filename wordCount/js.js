const INP = document.getElementById("input"),
    OUP = document.getElementById("output");

INP.addEventListener("keyup", function() {
    var v = this.value
            .toLowerCase()
            .split(/[^abcdefghihjklmopqrstuvwxyz]+/g),
        c = {},
        f = [],
        i = [];
    for (let i of v) {
        if (c[i]) {
            c[i]++;
        } else {
            c[i] = 1;
        }
    }
    for (let i in c) {
        if (!i) continue;
        f.push([i, c[i]]);
    }
    f.sort((a, b) => b[1] - a[1]);
    for (let x of f) {
        i.push(x.join(": "));
    }
    OUP.innerHTML = i.join(",<br>");
});

addEventListener("keydown", () => INP.focus());

INP.focus();
INP.value = `JaP is kewl. This is a sentence to test out this word counting thing. It should be able to count all my words.
This was created because I saw some YouTube video that said something about a word bubble thing. So I decided to make this thing. The main inspiration for this project was from the video.

Below this, you can see a word count, it orders from most frequent words to least frequently used words.

This works by taking whatever you type into this area, and splits it up according to the following regex rule:
    /[/\\\\,."\\s\\n(){}\\[\\];:!@#$%^&*1234567890+]+/g
The regex rule will find most punctuation, spaces, symbols, and numbers.



And now, Lorem Ipsum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at tortor sed massa convallis pulvinar. In congue malesuada turpis, eget dictum purus eleifend non. Mauris facilisis non purus nec egestas. Nunc eros velit, interdum non risus nec, consequat malesuada ex. Vivamus scelerisque turpis ac erat posuere, at elementum leo efficitur. Suspendisse a nisl iaculis, pellentesque orci eu, iaculis leo. Curabitur a metus a tortor malesuada maximus.

Nulla sed erat leo. Praesent in porta nibh. Morbi eget ligula sapien. Nullam nec lectus quam. Suspendisse eget justo id elit faucibus condimentum in nec nisl. Curabitur mauris urna, sodales tempus nunc eu, posuere sodales justo. Aliquam auctor rhoncus eros id feugiat.

Nam in arcu eleifend, iaculis est et, sagittis mi. Aenean dui purus, varius lobortis magna eget, rutrum lacinia justo. Etiam sit amet varius velit. Nam id vehicula erat, at dictum elit. Nulla venenatis vitae elit vel aliquam. Sed placerat ornare massa quis suscipit. Integer id lacus convallis, tempor odio nec, porttitor sapien. Vivamus neque sem, tristique at convallis ut, lacinia a augue. Sed risus nunc, maximus non tempus in, dignissim id tortor.

Donec tincidunt odio lacus, at luctus ex tincidunt pharetra. Aliquam at orci sollicitudin, interdum dui vel, pretium orci. Aliquam ac purus eget ante sagittis scelerisque quis ut justo. Mauris ac condimentum massa. Aenean fringilla ipsum sit amet orci auctor vestibulum. Vestibulum scelerisque ex sed justo fringilla, vel elementum lectus porttitor. Nulla bibendum nulla justo, et ornare lectus iaculis in. Nullam nec velit est. Nulla finibus sapien tincidunt justo efficitur varius. Nam convallis faucibus urna, sed vehicula ligula sodales vitae. Mauris volutpat mi mauris, non malesuada dolor imperdiet quis. Curabitur sit amet vulputate ipsum, ut tristique nunc.

Duis semper magna id libero tempus gravida. In varius velit nec aliquet blandit. Aliquam faucibus condimentum magna et elementum. In tempus risus eu erat accumsan egestas. Sed nec nibh semper velit aliquet congue laoreet sed ante. Integer malesuada turpis sit amet elit venenatis congue. Maecenas fringilla lorem id ultrices scelerisque. Suspendisse suscipit nulla sed fringilla ultrices. Vivamus facilisis neque eget nunc scelerisque ornare in a elit. Donec eget risus eros.`;
INP.dispatchEvent(new Event("keyup"));

__comment = [
    "slides: Format: [tag,content,x,y,width,length,css,animationCss,animationDurnation,animationDelay]",
    "resources: Format: [Type (img, data, site), url, !preload?]"
]

slides = [
    [
        ["div", "My 20Time Project", 361, 261, 1280, 50,
            "font-size:16px; opacity:1;", "opacity:0; left:100px;", 0.5,
            3.75
        ],
        ["div", "The Grammar Checker", 420, 291, 1200, 0,
            "font-size: 46px; opacity:1;", "opacity:0; top:100px;", 0.5,
            3.75
        ],
        ["script", "setTimeout(function(){slide((dt.slideIX++)+1);},4250)"]
    ],
    [
        ["div", "Why did I choose to make a Grammar Checker?", 74, 8, 1280,
            0,
            "font-size: 36px; font-weight:bold, opacity: 0.5; transform: scale(0);",
            "transform:scale(1); opacity:1;", 0.3, 0
        ],
        ["div",
            "I chose to make a Grammar Checker because when the 20Time project was assigned, it had to have something to do with with language, and I really wanted to code something for the project. But as you all know, this was later on revoked.",
            0, 76, 680, 1000, "opacity:0; font-size:24px;",
            "left:8px; opacity:1;", 0.275, 0.5
        ],
        ["div",
            "I would have changed the project when I heard about this, but at the time, I had at least 300 of code down already.",
            0, 208, 680, 1000, "opacity:0; left:-56px; font-size:24px;",
            "left:8px; opacity:1;", 0.275, 1
        ],
        ["div hidden",
            "By the way, this was what it looked like at the time (https://drive.google.com/a/pdsb.net/file/d/0B8ajbv6lg5eOeWtmQnEzcUVrZzA/view?usp=sharing), if you have time to copy down that link."
        ]
    ],
    [
        ["div", "Were there any obstacales I had to overcome?", 74, 8, 1280,
            0,
            "font-size: 36px; font-weight:bold, opacity: 0.5; transform: scale(0);",
            "transform:scale(1); opacity:1;", 0.3, 0
        ],
        ["div",
            "Yes, and very many. Coding takes a lot of time and retrying, I'll list them in chronological order of when I thought of them.",
            0, 76, 680, 1000, "opacity:0; font-size:24px;",
            "left:8px; opacity:1;", 0.275, 0.5
        ],
        ["ul type='-'",
            "<li> Grammar requires context. I needed a way to check the sentence, pharagraph and words around it.</li><li> There are way too many Grammar rules in English to implement in the amount of time given. </li><li>I haven't learned how to properly dynamically restyle singular words where the problem is.</li><li>And I couldn't find any online dictionaries that I could use for it.",
            0, 118, 680, 1000, "opacity:0; font-size:24px;",
            "left:8px; opacity:1;", 0.275, 0.5
        ]
    ],
    [
        ["div", "Were there any obstacales I <b>overcame</b>?", 74, 8, 1280,
            0,
            "font-size: 36px; font-weight:bold, opacity: 0.5; background: rgba(255,255,255,0.5); border-radius:4px;",
            "transform:scale(1); opacity:1; left:694px; top:8px;", 0.15,
            0.25
        ],
        ["div",
            "Yes, and very many. Coding takes a lot of time and retrying, I'll list them in chronological order of when I thought of them.",
            8, 76, 680, 1000, "opacity:1; font-size:24px;",
            "left:-20px; top:-36px; font-size: 12px;", 0.4, 0
        ],
        ["ol type='1'",
            "<li> Grammar requires context. I needed a way to check the sentence, pharagraph and words around it.</li><li> There are way too many Grammar rules in English to implement in the amount of time given. </li><li>I haven't learned how to properly dynamically restyle singular words where the problem is.</li><li>And I couldn't find any online dictionaries that I could use for it.",
            8, 118, 680, 1000, "opacity:1; font-size:24px;",
            "left:-20px; top:8px; width:592px;", 0.4, 0
        ],
        ["script", "$('b',1).outerHTML=$('b',1).innerHTML;", 1.25],
        ["ol type='1'",
            "<li>I got basic functionality of this. It can check the word behind it. I could do better through.</li><li>Of course I couldn't solve that. It's a time thing.</li><li>I've build something else to show where the error occurs in. This is not as good as an option, but will do for now.</li><li>While I was browsing the web to see how other grammar checks do things, I came across an open source dictionary. I then formatted it so my program can use it. But my way of checking the spelling was incredibly ineffiect <span class=greyed>(looking through the whole dictionary for every word)</span> and would lag the computer. I resolved this other obstacale by creating an index for the dictionary, and now is fully functioning.",
            ";", 76, 624, 1000,
            "right:-64px; opacity:0; font-size:24px; background:rgba(255,255,255,0.9);",
            "right: 8px; opacity:1;", 0.5, 1.5
        ],
        ["style", ".greyed{color:grey;}"]
    ]
]
resources = [
    ["img",
        "https://blogs.systweak.com/wp-content/uploads/BSOD-windows-7.png"
    ],
    ["site",
        "https://rawgit.com/JaPNaA/kKJFDKJHhAIULFyOWYR-YQ-eyouHSDUIiuamsd/master/2/index.html",
        true
    ]
]
JSONready = "Ready!"

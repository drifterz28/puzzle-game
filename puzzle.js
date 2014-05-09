//
(function() {
    'use strict';

    var id = 'js-puzzle_widget';
    var widget_location = document.getElementById(id);
    var image = '';
    var rows = 1;
    var columns = 1;
    var image_height = 1;
    var image_width = 1;

    function templateBase() {
        return [
            '<div class="puzzle_wrapper">',
            '<input type="url" class="image" placeholder="Image URL">',
            '<label>Columns <input type="number" class="columns" value="1"></label>',
            '<label>Rows <input type="number" class="rows" value="1"></label><button class="setup">Setup</button>',
            '<div id="puzzle"></div>'
        ].join('');
    }

    function shuffle(o) {
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getImageSize(image, callback) {
        // Get on screen image
        // Create new offscreen image to test
        var img = new Image();
        img.src = image;
        img.onload = function(){
            callback([img.width, img.height]);
        };
    }

    function buildPuzzle() {
        var new_divs = rows * columns;
        var puzzle = document.getElementById('puzzle');
        var box_width = image_width / columns;
        var box_height = image_height / rows;
        var html = [];
        var blank = getRandomInt(0, new_divs);
        var bg_pos_x = 0;
        var bg_pos_y = 0;
        // box size to match image size
        puzzle.style.height = image_height + 'px';
        puzzle.style.width = image_width + 'px';
        // XXX: temp set image
        //puzzle.style.background = 'url(' + image + ') no-repeat 0 0';

        for (var x = 0; x < new_divs; x++) {
            var blank_part = (x === blank)? ' blank' : '';
            html.push('<div class="innerdiv' + blank_part + '" data-count="' + x + '" style="background-image: url(' + image + ');background-position:-' + bg_pos_x + 'px -'+ bg_pos_y +'px;width: '+ box_width +'px;height: ' + box_height + 'px;"></div>');
            if (bg_pos_x >= (image_width - box_width)) {
                bg_pos_x = 0;
                bg_pos_y = bg_pos_y + box_height;
            } else {
                bg_pos_x = bg_pos_x + box_width;
            }
        }

        puzzle.innerHTML = '';
        puzzle.insertAdjacentHTML('afterbegin', shuffle(html).join(''));
        positionBlocks();
    }



    function positionBlocks() {
        var blocks = document.querySelectorAll('.innerdiv');
        var leng = blocks.length;
        for (var x=0; x < leng; x++) {
            var pos = getClipRect(blocks[x]);
            blocks[x].style.left = pos.left + 'px';
            blocks[x].style.top = pos.top + 'px';
            blocks[x].style.position = 'absolute';
        }
    }

    function getClipRect(obj) {
        if (typeof obj === 'string') {
            obj = document.querySelector(obj);
        }

        var curleft = 0;
        var curtop = 0;

        var findPos = function(obj) {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
            if(obj.offsetParent) {
                findPos(obj.offsetParent);
            }
        };
        findPos(obj);

        return {
            top: curtop,
            left: curleft,
            width: obj.offsetWidth,
            height: obj.offsetHeight
        };
    }

    function addEvent(el, type, fn){
        if(el && el.length) {
            for(var x = 0; x < el.length; x++) {
                el[x].addEventListener(type, fn, false);
            }
        } else if (el && el.nodeName || el === window) {
            el.addEventListener(type, fn, false);
        }
    }

    function events() {
        addEvent(document.querySelector('.setup'), 'click', function (e) {
            var new_image = document.querySelector('.image').value;
            var new_row = document.querySelector('.rows').value;
            var new_columns = document.querySelector('.columns').value;

            columns = (new_columns > 0) ? new_columns : columns;
            rows = (new_row > 1) ? new_row : rows;
            new_image = 'https://smoonapp.com/static/assets/img/smoon-romantic-compatibility-sample.png';
            // https://smoonapp.com/static/assets/img/smoon-romantic-compatibility-sample.png test image
            image = new_image;

            getImageSize(new_image, function (data){
                image_height = data[1];
                image_width = data[0];
                buildPuzzle();
            });

        });
    }

    function init() {

        widget_location.insertAdjacentHTML('beforebegin', templateBase());
        events();
    }

    init();
}());

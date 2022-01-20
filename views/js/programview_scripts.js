/* Template: Evolo - StartUp HTML Landing Page Template
   Author: Inovatik
   Created: June 2019
   Description: Custom JS file
*/



(function ($) {
    "use strict";
    /* Preloader */
    $(window).on('load', function () {
        $("#no_data").hide();
        $.ajax({
            type: "GET",
            url: "https://u-chart.kr/login/session",
            success: function (res) {
                if (res == "Fail") {
                    location.href = "signin";
                }
            },
            error: function (r, s, e) {
                location.href = "signin";
            },

        });
        var preloaderFadeOutTime = 500;
        function hidePreloader() {
            var preloader = $('.spinner-wrapper');
            setTimeout(function () {
                preloader.fadeOut(preloaderFadeOutTime);
            }, 500);
        }
        function submitMSG(valid, msg) {
            if (valid) {
                var msgClasses = "h3 text-center tada animated";
            } else {
                var msgClasses = "h3 text-center tada animated";
            }
            $("#no_data").removeClass().addClass(msgClasses).text(msg);
        }

        var programId = getQueryStringObject().program_name;
        $.ajax({
            type: "GET",
            url: "https://u-chart.kr/programInfo",
            data: { program_name: programId },
            success: function (json) {
                //Canvas 등록용

                var data = json[json.length - 1];

                var map = new Map();
                $("#chartResults").append('<canvas id="users"></canvas>');
                var labels_ = [];
                var data_ = [];
                var collected = false;
                json.forEach(function (json) {
                    labels_.push(new Date(json._id.split("/")[2]).getHours());
                    data_.push(json.users.length);
                    if (json.users.length > 0) {
                        collected = true;
                    }
                });
                if (!collected) {
                    $("#no_data").show();
                    var pname = data._id.split("/")[1];
                    $('#num').text("최근(" + data._id.split("/")[2] + ") 사용자 수: " + data.users.length);
                    $('#largen').text(pname);
                    $('#smalln').text(pname);
                    $('#programname1').text(pname);
                    $('#nnn').text(pname);
                    hidePreloader();
                    return;
                }
                var ctx = document.getElementById("users").getContext('2d');
                var chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels_,
                        datasets: [{
                            label: "시간대별 사용자 수(H)",
                            data: data_,
                            backgroundColor: "rgba(255, 201, 14, 1)",
                            borderColor: "rgba(255, 201, 14, 0.5)",
                            fill: false,
                            lineTension: 0
                        }]
                    },
                    options: {
                        maintainAspectRatio: true,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
                $.each(data.key_and_type, function (k, r) {
                    $("#chartResults").append('<canvas id="' + data.key_and_type[k].key + '"></canvas>');
                });
                var k = 0;
                data.key_and_type.forEach(function (key) {
                    var amap = new Map(); //key: 위의 key, value: map(아래)
                    json.forEach(function (json) {
                        if (json.users.length > 0) {
                            json.users.forEach(function (user) {
                                if (user.attribute.length > 0) {
                                    user.attribute.forEach(function (attr) {
                                        var kn = attr.key;
                                        var value = attr.value;
                                        if (kn.toString() == key.key.toString()) {
                                            amap.put(user.uuid, value);
                                        }
                                    });
                                }
                            });
                        } else {
                            k++;
                        }
                    });

                    map.put(key.key, amap);

                });

                map.keys().forEach(function (key) {

                    var map1 = map.get(key);
                    var count = new Map();
                    var backgroundColor = [];
                    var borderColor = [];
                    var data = [];
                    var labels = [];
                    map1.keys().forEach(function (uuid) {
                        var value = map1.get(uuid);
                        if (count.containsKey(value)) {
                            count.put(value, count.get(value) + 1);
                        } else {
                            count.put(value, 1);
                            labels.push(value);
                        }
                    });
                    labels.forEach(function (label) {
                        data.push(count.get(label));
                        backgroundColor.push(getRandomColor(true));
                        borderColor.push(getRandomColor(true));
                    });
                    createChart(key, labels, data, backgroundColor, borderColor);
                });
                /* data.key_and_type.forEach(function(key){
                     var keyntype = key.key;
                     var submap = new Map();
                     json.forEach(function(eachp){
                         if(eachp.users.length > 0){
                         eachp.users.forEach(function(user){
                             if(user.attribute.length > 0){
                             user.attribute.forEach(function(attr){
                                 var keyName = attr.key;
                                 var value = attr.value;
                                 if(keyntype == keyName.toString()){
                                     if(! submap.containsKey(value)){
                                         submap.put(value,0);
                                     }
                                     submap.put(value,submap.get(value)+1);
                                 }
                             });
                         }
                         });
                     }
                     });
                     map.put(keyntype,submap);
                 });
                 
                 map.keys().forEach(function(item){
                     var ctx = document.getElementById(item).getContext('2d');
                     var labels =[];
                     var data = [];
                    var  backgroundColor = [];
                    var  borderColor = [];
                    var submap = map.get(item);
                    submap.keys().forEach(function(item2){
                     labels.push(item2);
                     data.push(submap.get(item2));
                     backgroundColor.push(getRandomColor(true));
                     borderColor.push(getRandomColor(true));
                    });
                     var chart = new Chart(ctx,{
                          type:'bar',
                          data:{
                              labels: labels,
                              datasets: [{
                                  label: item,
                                  data: data,
                                  backgroundColor: backgroundColor,
                                  borderColor: borderColor,
                                  borderWidth:1
                              }]
                          },
                          options:{
                              maintainAspectRatio: true,
                              scales:{
                                  yAxes: [{
                                      ticks:{
                                          beginAtZero:true
                                      }
                                  }]
                              }
                          }
                      });
                 });
                 */
                var pname = data._id.split("/")[1];
                $('#num').text("최근(" + data._id.split("/")[2] + ") 사용자 수: " + data.users.length);
                $('#largen').text(pname);
                $('#smalln').text(pname);
                $('#programname1').text(pname);
                $('#nnn').text(pname);
            },
            error: function (r, s, e) {

            },

        });


        hidePreloader();
    });
    function createChart(keyName, labels, data, backgroundColor, borderColor) {
        var ctx = document.getElementById(keyName).getContext('2d');
        var chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: keyName,
                    data: data,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }
    function getQueryStringObject() {
        var a = window.location.search.substr(1).split('&');
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    }
    var getRandomColor = function (_isAlpha) {
        let r = getRand(0, 255),
            g = getRand(0, 255),
            b = getRand(0, 255),
            a = getRand(0, 10) / 10;

        let rgb = _isAlpha ? 'rgba' : 'rgb';
        rgb += '(' + r + ',' + g + ',' + b;
        rgb += _isAlpha ? ',' + a + ')' : ')';

        return rgb;

        // Return random number from in to max
        function getRand(min, max) {
            if (min >= max) return false;
            return ~~(Math.random() * (max - min + 1)) + min;
        };
    };

    Map = function () {
        this.map = new Object();
    };
    Map.prototype = {
        put: function (key, value) {
            this.map[key] = value;
        },
        get: function (key) {
            return this.map[key];
        },
        containsKey: function (key) {
            return key in this.map;
        },
        containsValue: function (value) {
            for (var prop in this.map) {
                if (this.map[prop] == value) return true;
            }
            return false;
        },
        isEmpty: function (key) {
            return (this.size() == 0);
        },
        clear: function () {
            for (var prop in this.map) {
                delete this.map[prop];
            }
        },
        remove: function (key) {
            delete this.map[key];
        },
        keys: function () {
            var keys = new Array();
            for (var prop in this.map) {
                keys.push(prop);
            }
            return keys;
        },
        values: function () {
            var values = new Array();
            for (var prop in this.map) {
                values.push(this.map[prop]);
            }
            return values;
        },
        size: function () {
            var count = 0;
            for (var prop in this.map) {
                count++;
            }
            return count;
        }
    };

    /* Navbar Scripts */
    // jQuery to collapse the navbar on scroll
    $(window).on('scroll load', function () {
        if ($(".navbar").offset().top > 60) {
            $(".fixed-top").addClass("top-nav-collapse");
        } else {
            $(".fixed-top").removeClass("top-nav-collapse");
        }
    });

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(function () {
        $(document).on('click', 'a.page-scroll', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 600, 'easeInOutExpo');
            event.preventDefault();
        });
    });

    // closes the responsive menu on menu item click
    $(".navbar-nav li a").on("click", function (event) {
        if (!$(this).parent().hasClass('dropdown'))
            $(".navbar-collapse").collapse('hide');
    });




    /* Video Lightbox - Magnific Popup */
    $('.popup-youtube, .popup-vimeo').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        iframe: {
            patterns: {
                youtube: {
                    index: 'youtube.com/',
                    id: function (url) {
                        var m = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
                        if (!m || !m[1]) return null;
                        return m[1];
                    },
                    src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                },
                vimeo: {
                    index: 'vimeo.com/',
                    id: function (url) {
                        var m = url.match(/(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/);
                        if (!m || !m[5]) return null;
                        return m[5];
                    },
                    src: 'https://player.vimeo.com/video/%id%?autoplay=1'
                }
            }
        }
    });


    /* Lightbox - Magnific Popup */
    $('.popup-with-move-anim').magnificPopup({
        type: 'inline',
        fixedContentPos: false, /* keep it false to avoid html tag shift with margin-right: 17px */
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom'
    });


    /* Move Form Fields Label When User Types */
    // for input and textarea fields
    $("input, textarea").keyup(function () {
        if ($(this).val() != '') {
            $(this).addClass('notEmpty');
        } else {
            $(this).removeClass('notEmpty');
        }
    });


    /* Back To Top Button */
    // create the back to top button
    $('body').prepend('<a href="body" class="back-to-top page-scroll">Back to Top</a>');
    var amountScrolled = 700;
    $(window).scroll(function () {
        if ($(window).scrollTop() > amountScrolled) {
            $('a.back-to-top').fadeIn('500');
        } else {
            $('a.back-to-top').fadeOut('500');
        }
    });


    /* Removes Long Focus On Buttons */
    $(".button, a, button").mouseup(function () {
        $(this).blur();
    });

})(jQuery);

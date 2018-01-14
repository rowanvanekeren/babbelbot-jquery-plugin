(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {
    $.fn.babbelbot = function (options) {

        var bStylesheetExists = false;
        var currentUser = null;
        $('link').each(function () {
            if ($(this).attr('href').substr(this.href.lastIndexOf('/') + 1) === 'babbelbot.css') {
                bStylesheetExists = true;
            }
        });

        if (bStylesheetExists === false) {
            throw Error("Missing babbelbot.css please include it in the header");
        }

        //jQuery(this).attr("id", "bb-main");
        jQuery(this).empty();

        var mainBot = jQuery(this);

        mainBot.css('position', 'relative');

        var settings = $.extend({
            accessToken : '',
            botBg: "#185355",
            botColor: "#fff",
            userBg: "#4ca78c",
            userColor: "#fff",
            titleBg: '#4ca78c',
            titleColor: '#fff',
            chatHeight: '200px',
            border: 'none',
            inputTopBorder: '1px solid #dddddd',
            babbelbotUrl: '',
            quickReplyBorder: '1px solid #185355',
            quickReplyColor: '#185355',
            standardOpen : true,
            title : 'Babbelbot',
            botName : 'Babbelbot'
        }, options);

        /* check if bot is available */
        pingToServerChatbot();

        mainBot.append(
            '<div id="bb-chatbox-title">Test title</div>' +
            '<div id="bb-chatbox-inner">' +
            '<div id="bb-chatbox-conversation">' +
            '<div id="bb-chatbox-conversation-inner">' +
            '</div>' +
            '</div>' +
            '<div id="bb-chatbox-input">' +
            '<textarea placeholder="Typ hier je bericht">' + '</textarea>' +
            '</div>' +
            '</div>');


        var scrollDiv = mainBot.find("#bb-chatbox-conversation-inner");


        /* apply user options */
        mainBot.find('#bb-chatbox-title').css({
            'backgroundColor': settings.titleBg,
            'color': settings.titleColor,
            'border': settings.border,

        });
        mainBot.find('#bb-chatbox-title').text(settings.title);

        mainBot.find('#bb-chatbox-conversation').css({

            'borderLeft': settings.border,
            'borderRight': settings.border,
            'height': settings.chatHeight
        });

        mainBot.find('#bb-chatbox-input').css({

            'border': settings.border,
            'border-top': settings.inputTopBorder,
        });

        if(settings.standardOpen){
            mainBot.find('#bb-chatbox-inner').css({
                maxHeight: (parseInt(settings.chatHeight, 10) + 100) + 'px'
            });
        }else{
            mainBot.find('#bb-chatbox-inner').css({
                maxHeight:0
            });
        }


        /* check if user exists */

        if(readCookie('bb_chatbot_user') != null && typeof readCookie('bb_chatbot_user') != 'undefined' ){
            currentUser = readCookie('bb_chatbot_user');
        }else{
            var generator = new IDGenerator();
            currentUser = generator.generate();
            createCookie('bb_chatbot_user', currentUser, 1);
        }

        /* localStorage Variant */

    /*    if(localStorage.getItem('bb_chatbot_user') != null && typeof localStorage.getItem('embed_chatbot_user') != 'undefined' ){
            currentUser = localStorage.getItem('bb_chatbot_user');
        }else{
            var generator = new IDGenerator();
            currentUser = generator.generate();

            localStorage.setItem('bb_chatbot_user', currentUser);
        }*/



        mainBot.find('#bb-chatbox-input').keypress(function (e) {
            if (e.which == 13 && !e.shiftKey) {
                e.preventDefault();
                if(mainBot.find('#bb-chatbox-input textarea').val().length > 0){


                mainBot.find('#bb-chatbox-conversation-inner').append(
                    '<div class="bb-chat-row">' +
                    '<div class="bb-user-sender">' + getCurrentTime() + ' <span>Jij</span></div>' +
                    '<div style="clear:both"></div>' +
                    '<div class="bb-user" style="color:' + settings.userColor + '; background-color: ' + settings.userBg + '">' +
                    mainBot.find('#bb-chatbox-input textarea').val()
                    + '</div>' +
                    '<div style="clear:both"></div>' +
                    '</div>');

                scrollDiv.scrollTop(scrollDiv[0].scrollHeight);

               doWitRequest(mainBot.find('#bb-chatbox-input textarea').val(), currentUser);

                mainBot.find('#bb-chatbox-input textarea').val('').scrollTop(0);

                }else{
                 mainBot.find('#bb-chatbox-input textarea').val('').scrollTop(0);
                }

            }
        });


        mainBot.find('#bb-chatbox-title').click(function () {
            if (mainBot.find('#bb-chatbox-inner').height() == 0) {
                mainBot.find('#bb-chatbox-inner').animate({
                    maxHeight: (parseInt(settings.chatHeight, 10) + 100) + 'px'
                }, 500);
            } else {
                mainBot.find('#bb-chatbox-inner').animate({
                    maxHeight: 0
                }, 500);
            }
        });


        function typingOn(){
            mainBot.find('#bb-chatbox-conversation-inner').append(
                '<div class="bb-chat-row typing">' +
                '<div class="bb-chatbot-sender"> <span>Babbelbot </span>' + getCurrentTime() + '</div>' +
                '<div style="clear:both"></div>' +
                '<div class="bb-chatbot" style="color:' + settings.botColor + '; background-color: ' + settings.botBg + '">' +
                text
                + '</div>' +
                '<div style="clear:both"></div>' +
                '</div>');
        }
        function doWitRequest(text, user_id){
            $.ajax({
                url: 'https://api.wit.ai/message?v=20170307',

                type: 'get',
                headers: {"Authorization": 'Bearer ' + settings.accessToken},
                data: {
                    q : text,
                },
                success: function( data, textStatus ){
                    console.log(data);
                    postRequestToBabbelbot(data, text , user_id);
                },
                error: function(data, textStatus ){
                    console.log(data);
                }
            })
        }
        function postRequestToBabbelbot(witData, text, user){
            $.ajax({
                url: settings.babbelbotUrl,
                dataType: 'json',
                type: 'post',

                data: {
                    wit_data : witData,
                    user_input : text,
                    user_id : user
                },
                success: function( data, textStatus ){

                    processMessages(data);
                    processQuickReplies(data);
                },
                error: function(data, textStatus ){

                }
            })
        }

        function processMessages(answerObj){
            if(typeof answerObj.answers != 'undefined' && answerObj.answers.length > 0){
                var randAnswer = answerObj.answers[Math.floor(Math.random() * answerObj.answers.length)];
                responseMessageBot(randAnswer.answer);
            }
        }

        function processQuickReplies(answerObj){
            console.log(answerObj);
            var quick_replies = '';
            if(typeof answerObj.quick_replies != 'undefined' && answerObj.quick_replies.length > 0){

                for(var i = 0; i < answerObj.quick_replies.length; i++){
                    quick_replies += '<div class="quick-reply" style="border: ' + settings.quickReplyBorder +'; color: ' + settings.quickReplyColor + '">' + answerObj.quick_replies[i].answer +  ' </div>';

                    console.log(answerObj.quick_replies[i].answer);
                }
            }

            var quick_replies_dom =  '<div class="bb-chat-row quick-replies">' +


                '<div class="bb-chatbot-quick-replies" >' +
                quick_replies
                + '</div>' +
                '<div style="clear:both"></div>' +
                '</div>';

            mainBot.find('#bb-chatbox-conversation-inner').append(quick_replies_dom);

            scrollDiv.scrollTop(scrollDiv[0].scrollHeight);

            $('.quick-reply').click(function() {

                var currentText = $(this).text();
                mainBot.find('#bb-chatbox-conversation-inner').append(
                    '<div class="bb-chat-row">' +
                    '<div class="bb-user-sender">' + getCurrentTime() + ' <span>Jij</span></div>' +
                    '<div style="clear:both"></div>' +
                    '<div class="bb-user" style="color:' + settings.userColor + '; background-color: ' + settings.userBg + '">' +
                    currentText
                    + '</div>' +
                    '<div style="clear:both"></div>' +
                    '</div>');

                scrollDiv.scrollTop(scrollDiv[0].scrollHeight);

                $( ".bb-chatbot-quick-replies" ).remove();
                doWitRequest(currentText, currentUser);

            });
        }


        function pingToServerChatbot(){
            $.ajax({
                url: settings.babbelbotUrl,

                type: 'get',

                data: {
                    type : 'ping'
                },
                success: function( data, status, jQxhr ){

                    if(status == 'success'){
                        console.log(data);
                    }
                },
                error: function( data, status, errorThrown ){
                        throw Error("Cannot ping to server please fix connection");
                    }
            });
        }
        function responseMessageBot(text){
            mainBot.find('#bb-chatbox-conversation-inner').append(
                '<div class="bb-chat-row">' +
                '<div class="bb-chatbot-sender"> <span>' + settings.botName +  ' </span>' + getCurrentTime() + '</div>' +
                '<div style="clear:both"></div>' +
                '<div class="bb-chatbot" style="color:' + settings.botColor + '; background-color: ' + settings.botBg + '">' +
                urlify(nl2br(text))
                + '</div>' +
                '<div style="clear:both"></div>' +
                '</div>');

                scrollDiv.scrollTop(scrollDiv[0].scrollHeight);
        }

        function nl2br (str, is_xhtml) {
            var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
            return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
        }

        function urlify(text) {
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, function(url) {
                return '<a href="' + url + '">' + url + '</a>';
            });
            // or alternatively
            // return text.replace(urlRegex, '<a href="$1">$1</a>')
        }

        function getCurrentTime(){
            var dt = new Date();
            var time = (dt.getHours()<10?'0':'') + dt.getHours() + ":" + (dt.getMinutes()<10?'0':'') + dt.getMinutes();

            return time;
        }

        function createCookie(name,value,days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        }

        function readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }

        function eraseCookie(name) {
            createCookie(name,"",-1);
        }

        function IDGenerator() {

            this.length = 8;
            this.timestamp = +new Date;

            var _getRandomInt = function (min, max) {
                return Math.floor(Math.random() * ( max - min + 1 )) + min;
            }

            this.generate = function () {
                var ts = this.timestamp.toString();
                var parts = ts.split("").reverse();
                var id = "";

                for (var i = 0; i < this.length; ++i) {
                    var index = _getRandomInt(0, parts.length - 1);
                    id += parts[index];
                }

                return id;
            }
        }
    };


});

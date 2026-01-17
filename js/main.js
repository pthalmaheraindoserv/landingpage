
(function ($) {
    "use strict";

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    
    
   /*==================================================================
    [ Simple slide100 ]*/

    function markOrientation($el) {
        var bg = $el.css('background-image') || '';
        var url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        if(!url) return;
        var img = new Image();
        img.onload = function() {
            var isPortrait = this.naturalHeight > this.naturalWidth;
            if(isPortrait) {
                $el.addClass('portrait');
                // Hanya layer utama (tanpa blur)
                if ($el.find('.bg-main').length === 0) {
                    $el.append('<div class="bg-main"></div>');
                }
                // Pastikan layer blur dihapus jika ada sisa dari versi sebelumnya
                $el.find('.bg-blur-fill').remove();
                var $main = $el.find('.bg-main');
                $main.css('background-image', 'url("'+url+'")');
                // Hilangkan background pada item agar anak yang tampil
                $el.css('background-image', 'none');
            } else {
                $el.addClass('landscape');
                // Untuk landscape, biarkan background di item sebagai cover
            }
        };
        img.src = url;
    }

    $('.simpleslide100').each(function(){
        var delay = 47000;
        var speed = 1000;
        var itemSlide = $(this).find('.simpleslide100-item');
        var count = itemSlide.length;
        if (count === 0) return;
        var current = 0;
        var next = (current + 1) % count;

        // Tandai orientasi gambar (portrait/landscape)
        $(itemSlide).each(function(){ markOrientation($(this)); });

        $(itemSlide).hide();
        $(itemSlide).filter(':first').show();

        setInterval(function(){
            $(itemSlide).removeClass('fade-in fade-out slide-vert-in slide-vert-out');
            $(itemSlide).css({
                'z-index': 0
            });

            var next = current + 1;
            if(next >= $(itemSlide).length) { next = 0; }

            var $currentEl = $(itemSlide).eq(current);
            var $nextEl = $(itemSlide).eq(next);

            // Atur z-index agar slide masuk di atas
            $currentEl.css('z-index', 1);
            $nextEl.css('z-index', 2);

            // Bedakan perilaku untuk portrait vs landscape
            var nextIsPortrait = $nextEl.hasClass('portrait');

            $currentEl.show();
            $nextEl.show();

            if (nextIsPortrait && $nextEl.find('.bg-main').length) {
                // Portrait: pan vertikal halus pada layer utama dari bawah ke atas
                var $main = $nextEl.find('.bg-main');

                // Pastikan posisi awal dari bawah
                $main.css('background-position', 'center bottom');
                $main.show();

                // Animasi masuk untuk container, sekaligus pan pada bg-main
                $nextEl.addClass('slide-vert-in');
                $currentEl.addClass('slide-vert-out');
                // Set durasi pan sesuai permintaan
                 $main.css('--pan-duration', '40s');
                 $main.addClass('pan-vert');

                setTimeout(function(){
                    $currentEl.hide().removeClass('slide-vert-out');
                    $nextEl.removeClass('slide-vert-in');
                    // Biarkan pan berjalan selama slide tampil
                    current = next;
                }, speed);

                // Reset pan pada slide lama
                $currentEl.find('.bg-main').removeClass('pan-vert').css('background-position','center bottom');
            } else {
                // Landscape: gunakan fade
                $currentEl.addClass('fade-out');
                $nextEl.addClass('fade-in');

                setTimeout(function(){
                    $currentEl.hide().removeClass('fade-out');
                    $nextEl.removeClass('fade-in');
                    current = next;
                }, speed);
            }

        }, delay);
    });


})(jQuery);
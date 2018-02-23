(function ($) {
    "use strict";
    var doneContest = false

    var i18n = window.domI18n({
        selector: '[data-translatable]',
        separator: ' // ',
        languages: ['es', 'en'],
        defaultLanguage: 'en'
    });

    i18n.changeLanguage(getNavigatorLanguage());

    $('.page-scroll a').bind('click', function (event) {
        event.preventDefault();
        if (doneContest) {
            slowScroll($(this).attr('href'), event);
        } else {
            askForContest($(this), event);
        }
    });

    $('#profile').bind('click', function (event) {
        event.preventDefault();
        if (doneContest) {
            slowScroll('#work', event);
        } else {
            askForContest($(this), event);
        }
    });

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    $('.navbar-collapse ul li a').click(function () {
        $('.navbar-toggle:visible').click();
    });

    $('#mainNav').affix({
        offset: {
            top: 100
        }
    });

    $('#ok-image').click(function () {
        $('.close-modal').trigger("click");
        setTimeout(function () {
            $('#contestModalLinkOk').trigger("click");
        }, 500);
        notifyContestEvent( 'Contest try' );
      

    });

    $('.enoughWithThisShit').click(function () {
        doContest();
        $('.close-modal').trigger("click");
        slowScroll('#work', event);
        notifyContestEvent( 'Enough with this shit' );
    });

    $('.fakeAnswer').click(function () {
        $('#fakeQuestion').hide('slow');
        $('#contestQuestion').removeClass('hidden');
    });
    
    $('#resolveBtn').click(function (event) {
        event.preventDefault();
        var cousins = [$('#cousin1'), $('#cousin2'), $('#cousin3')];
        if (validateForm(cousins)) {
            showSuccessMessage();
            setTimeout(function () {
                doContest();
                $('.close-modal').trigger("click");
                slowScroll($('#ok-image').data('href'), event);
            }, 1000);

        } else {
            showErrorMessage();
        }
    });

    $('#other-lang, #other-transversal, #other-technologies, #other-personality').one('click', function () {
        showChart($(this));
    });


    function validateForm(cousins) {
        if (cousins[0].val() == 2 && cousins[1].val() == 11 && cousins[2].val() == 17) {
            return true
        }
        else if (cousins[0].val() == 2 && cousins[1].val() == 5 && cousins[2].val() == 23) {
            return true
        }
    }

    function showSuccessMessage() {
        $('#wrongAnswer').hide();
        $('#goodAnswer').hide();
        $('#goodAnswer').fadeIn('slow');
        notifyContestEvent( 'Contest success' );
    }

    function showErrorMessage() {
        $('#goodAnswer').hide();
        $('#wrongAnswer').hide();
        $('#wrongAnswer').fadeIn('slow');
        notifyContestEvent( 'Contest error' );

    }

    function askForContest(element, event) {
        $('#contestModalLink').trigger("click");
        $('#ok-image').data('href', element.attr('href'));
        $('#ko-image').data('href', element.attr('href'));
    }

    function doContest() {
        window.scrollTo(0, 0);
        $('#secret').show();
        doneContest = true;
    }

    function slowScroll(href, event) {
        $('html, body').stop().animate({
            scrollTop: ($(href).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        if (event != null) { event.preventDefault() };
    }

    function showChart(element) {
        var abilityArray = getAbilityArrayFromElementId(element[0].id, getLanguageIndex());
        var chart = c3.generate({
            bindto: '#' + element.children('.chartContainer')[0].id,
            data: {
                columns: [
                    abilityArray[0]
                ],
                type: 'bar',
                width: {
                    ratio: 1.5
                }
            }
        });

        setTimeout(function () {
            _recursiveChart(1, abilityArray)
        }, 1000);

        function getAbilityArrayFromElementId(id, languageId) {
            if (id === "other-technologies") {
                return technologies[languageId];
            } else if (id === "other-lang") {
                return languages[languageId];
            } else if (id === "other-transversal") {
                return trasnsversals[languageId];
            } else {
                return personality[languageId];
            }
        }

        function _recursiveChart(index, abilityArray) {
            if (abilityArray[index] == null) {
                return false
            }
            chart.flow({
                columns: [
                    abilityArray[index]
                ],
                duration: 500,
                done: function () {
                    index++;
                    _recursiveChart(index, abilityArray)
                }
            });
        }
    }

    function getLanguageIndex() {
        if (window.navigator.language === "es" || window.navigator.language.indexOf("es") === 0) {
            return 0
        } else {
            return 1
        }
    }

    function getNavigatorLanguage() {
        return window.navigator.language;
    }

    function notifyContestEvent( eventLabel ) {
        ga('create', 'UA-113266002-2');
        ga('send', 'event', 'contest', 'click', eventLabel);
    }

})(jQuery);
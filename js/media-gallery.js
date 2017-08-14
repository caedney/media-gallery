(function($) {

    //Create Gallery Object and ID galID
    var galObj = {},
        galID = 0;

    //Check images or video
    var checkMedia = function($this, alias) {
        if (alias.match(/youtube.com/g)) {
            var video_id = alias.split('v=')[1];
            var ampersandPosition = video_id.indexOf('&');
            if (ampersandPosition !== -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }
            alias = video_id;
            var iframe = {
                url: '//www.youtube.com/embed/' + alias
            };
        } else if (alias.match(/vimeo.com/g)) {
            alias = alias.match(/\d+/g);
            var iframe = {
                url: '//player.vimeo.com/video/' + alias
            };
        } else {
            alias = alias.replace(/[^A-Z0-9a-z-]/g, '');
        }
        containsObj($this, alias, iframe);
    };

    //Check if object exists
    var containsObj = function($this, alias, iframe) {
        if (galObj.hasOwnProperty(alias)) {
            galInit($this, alias);
        } else {
            getContent($this, alias, iframe);
        }
    };

    // Create new object based on content
    var getContent = function($this, alias, iframe) {
        if (iframe) {
            //Create New Gallery Object Properties
            galObj[alias] = new Object;
            galObj[alias].content = [{
                'src': iframe.url,
                'iframe': true
            }];
            galObj[alias].id = galID += 1;
            //Initialise Light Gallery
            galInit($this, alias);
        } else {
            $.ajax({
                type: 'GET',
                url: alias,
                dataType: 'html',
                beforeSend: function() {
                    $('#loading').show();
                },
                success: function(data, success) {
                    //Find first Thumbnail Gallery on page
                    var contentLoad = $(data).find('.photoGalleryElement')[0];
                    //Map Contents of Fluency Thumbnail Gallery
                    var galData = $(contentLoad).find('.thumbContents a').map(function(ind, img) {
                        return {
                            'src': $(img).attr('href'),
                            'thumb': $(img).find('img').attr('src'),
                            'subHtml': $(img).find('img').attr('alt')
                        };
                    });
                    //Create New Gallery Object Properties
                    galObj[alias] = new Object;
                    galObj[alias].content = $.makeArray(galData);
                    galObj[alias].id = galID += 1;
                    //Initialise Light Gallery
                    galInit($this, alias);
                },
                complete: function() {
                    setTimeout(function() {
                        $('#loading').fadeOut(500);
                    }, 0);
                }
            });
        }
    };

    // Initialise Light Gallery
    var galInit = function($this, alias) {
        $this.lightGallery({
            dynamic: true,
            dynamicEl: galObj[alias].content,
            download: false,
            galleryId: galObj[alias].id,
            mode: 'lg-fade',
            cssEasing: 'cubic-bezier(0.25, 0, 0.25, 1)'
        });
    };

}(jQuery));

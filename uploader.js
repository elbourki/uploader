/**
 * uploader
 *
 * Plugin to upload files with ajax with progress bar
 * inspired from Abban
 * 
 * July 2017
 * 
 * @version 1.0
 * @author Abde ssamade El Bourki https://www.elbourki.com
 * @license MIT
 * 
 */
;(function($, window, document, undefined)
{
    var pluginName = "uploader",
        defaults = {
            action        : "",
            uploadText    : "Upload file",
            uploadingText : "Uploading file",
            uploadedText  : "File uploaded successfully",
            uploadData    : {},
            uploadOptions : {},
            before        : function(){},
            success       : function(){},
            error         : function(){},
            complete      : function(){}
        };

    function Plugin(element, options)
    {
        this.element    = element;
        this.$input      = $(element);
        this.$form      = $(element);
        this.$uploaders = $('input[type=file]', this.element);
        this.files      = {};
        this.settings   = $.extend({}, defaults, options);
        this._defaults  = defaults;
        this._name      = pluginName;
        this.init();
    }

    Plugin.prototype = 
    {
		
        init: function()
        {
			this.$input.wrap('<label style="position: relative;"></label>');
			this.$input.css({"position": "absolute","top": "0","left": "0","opacity": "0"});
			this.$input.after('<div style="padding: 5px;border-radius: 3px;background: #6184d8;cursor: pointer;position: relative;" class="uploader"><div class="uploader_progress" style="background: rgba(255, 255, 255, 0.3) none repeat scroll 0% 0%;height: 100%;position: absolute;width: 0%;top: 0px;left: 0px;right: 0px;bottom: 0px;z-index: 0;"></div><img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4Ni4zIDQ4Ni4zIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0ODYuMyA0ODYuMzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zOTUuNSwxMzUuOGMtNS4yLTMwLjktMjAuNS01OS4xLTQzLjktODAuNWMtMjYtMjMuOC01OS44LTM2LjktOTUtMzYuOWMtMjcuMiwwLTUzLjcsNy44LTc2LjQsMjIuNSAgICBjLTE4LjksMTIuMi0zNC42LDI4LjctNDUuNyw0OC4xYy00LjgtMC45LTkuOC0xLjQtMTQuOC0xLjRjLTQyLjUsMC03Ny4xLDM0LjYtNzcuMSw3Ny4xYzAsNS41LDAuNiwxMC44LDEuNiwxNiAgICBDMTYuNywyMDAuNywwLDIzMi45LDAsMjY3LjJjMCwyNy43LDEwLjMsNTQuNiwyOS4xLDc1LjljMTkuMywyMS44LDQ0LjgsMzQuNyw3MiwzNi4yYzAuMywwLDAuNSwwLDAuOCwwaDg2ICAgIGM3LjUsMCwxMy41LTYsMTMuNS0xMy41cy02LTEzLjUtMTMuNS0xMy41aC04NS42QzYxLjQsMzQ5LjgsMjcsMzEwLjksMjcsMjY3LjFjMC0yOC4zLDE1LjItNTQuNywzOS43LTY5ICAgIGM1LjctMy4zLDguMS0xMC4yLDUuOS0xNi40Yy0yLTUuNC0zLTExLjEtMy0xNy4yYzAtMjcuNiwyMi41LTUwLjEsNTAuMS01MC4xYzUuOSwwLDExLjcsMSwxNy4xLDNjNi42LDIuNCwxMy45LTAuNiwxNi45LTYuOSAgICBjMTguNy0zOS43LDU5LjEtNjUuMywxMDMtNjUuM2M1OSwwLDEwNy43LDQ0LjIsMTEzLjMsMTAyLjhjMC42LDYuMSw1LjIsMTEsMTEuMiwxMmM0NC41LDcuNiw3OC4xLDQ4LjcsNzguMSw5NS42ICAgIGMwLDQ5LjctMzkuMSw5Mi45LTg3LjMsOTYuNmgtNzMuN2MtNy41LDAtMTMuNSw2LTEzLjUsMTMuNXM2LDEzLjUsMTMuNSwxMy41aDc0LjJjMC4zLDAsMC42LDAsMSwwYzMwLjUtMi4yLDU5LTE2LjIsODAuMi0zOS42ICAgIGMyMS4xLTIzLjIsMzIuNi01MywzMi42LTg0QzQ4Ni4yLDE5OS41LDQ0Ny45LDE0OS42LDM5NS41LDEzNS44eiIgZmlsbD0iI0ZGRkZGRiIvPgoJCTxwYXRoIGQ9Ik0zMjQuMiwyODBjNS4zLTUuMyw1LjMtMTMuOCwwLTE5LjFsLTcxLjUtNzEuNWMtMi41LTIuNS02LTQtOS41LTRzLTcsMS40LTkuNSw0bC03MS41LDcxLjVjLTUuMyw1LjMtNS4zLDEzLjgsMCwxOS4xICAgIGMyLjYsMi42LDYuMSw0LDkuNSw0czYuOS0xLjMsOS41LTRsNDguNS00OC41djIyMi45YzAsNy41LDYsMTMuNSwxMy41LDEzLjVzMTMuNS02LDEzLjUtMTMuNVYyMzEuNWw0OC41LDQ4LjUgICAgQzMxMC40LDI4NS4zLDMxOC45LDI4NS4zLDMyNC4yLDI4MHoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" style="background: rgba(255, 255, 255, 0.2);padding: 10px;width: 25px;border-radius: 3px;float: left;"/><div style="float: left;color: white;line-height: 45px;padding: 0px 10px;" class="uploader_text">'+this.settings.uploadText+'</div><div style="clear: both;"></div></div>');
            this.$input.on('change', { context : this }, this.uploadFiles);
        },
		
        uploadFiles: function(event)
        {
            event.stopPropagation();
            event.preventDefault();
			$('.uploader').css({"background": "#6184d8"});
			$("input").prop('disabled', true);
            var self = event.data.context;
            self.files[$(event.target).attr('name')] = event.target.files;

            self.settings.before();

            var data = new FormData();

            $.each(self.files, function(key, field)
            {
                $.each(field, function(key, value)
                {
                    data.append(key, value);
                });
            });

            $.each(self.settings.uploadData, function(key, value)
            {
                data.append(key, value);
            });

            $.ajax($.extend({}, {
                url: self.settings.action,
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
				xhr: function () {
					var xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							$('.uploader_text').text(self.settings.uploadingText + ' ' + Math.round(percentComplete * 100) + '%');
							$('.uploader_progress').css({
								width: percentComplete * 100 + '%',
								display: "block"
							});
							if (percentComplete === 1) {
								$('.uploader_progress').css({"display": "none"});
							}
						}
					}, false);
					return xhr;
				},
                processData: false,
                contentType: false,
                success: function(data, textStatus, jqXHR){ 
					$('.uploader').css({"background": "#2ECC71"});
					$('.uploader_text').text(self.settings.uploadedText);
					self.settings.success(data, textStatus, jqXHR); 
				},
                error: function(jqXHR, textStatus, errorThrown){ 
					$('.uploader').css({"background": "#EF4836"});
					$('.uploader_text').text("Error : " + errorThrown);
					$("input").prop('disabled', false);
					self.settings.error(jqXHR, textStatus, errorThrown); 
				},
				complete: function(jqXHR, textStatus){ 
					$("input").prop('disabled', false);
					self.settings.complete(jqXHR, textStatus); 
				}
            }, self.settings.uploadOptions));
        },
    };

    $.fn[pluginName] = function(options)
    {
        return this.each(function()
        {
            if(!$.data(this, "plugin_" + pluginName))
            {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);

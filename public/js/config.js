
function addBadge() {
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('download')) {
    return;
  }
  const hostName = window.location.hostname;
  const path = window.location.pathname;
  const current_url = encodeURIComponent(`${hostName}${path}`);

  var lindoBadge = `
  <style>
  .lindo-badge {
    position: fixed;
    z-index: 100;
    bottom: 20px;
    left: 20px;
    width: 160px;
  }
  </style>
  <!-- LINDO BADGE -->
  <div class="lindo-badge">
    <a target="_blank" href="https://www.lindoai.com?utm_source=badge&utm_medium=${current_url}">
        <img src="https://cdn.lindoai.com/image/lindo-badge.png" alt=""/>
    </a>
  </div>
`;

  $(function () {
    $('body').append(lindoBadge);
  });
}

$(document).ready(function () {
  const hostname = window.location.hostname;
  const stage = hostname.indexOf('joinlindo.com') !== -1 || window.location.pathname.indexOf('/staging') !== -1 ? "staging" : hostname.indexOf('localhost') !== -1 || hostname.indexOf('127.0.0.1') !== -1 ? "local" : "prod";
  const baseCdn = stage === "prod" ? "https://cdn.lindoai.com" : stage === "staging" ? "https://cdn.lindoai.com/staging" : "/cdn";
  const queryParams = new URLSearchParams(window.location.search);

  if (queryParams.get('data')) {

    var scripts = [
      // "/cdn/js/preline.js",
      "https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.4/flowbite.min.js",
      `${baseCdn}/js/editor.js`,
    ];

    // Load each script sequentially
    var i = 0;
    var loadScript = function () {
      if (i < scripts.length) {
        var scriptUrl = scripts[i];
        var script = document.createElement('script');
        script.onload = loadScript;
        script.src = scriptUrl;
        document.body.appendChild(script);
        i++;
      }
    };

    loadScript();
  } else {

    // $("head").append(`<link href="https://cdn.lindoai.com/css/global.css" rel="stylesheet" type="text/css">`);

    // $('[lindo-btn]').click(function () {
    //   window.location.href = $(this).attr('href');
    // });

    $('[lindo-image]').each(function () {
      var img = $(this);
      var size = $(this).attr('lindo-img-size');
      if (!size) return;
      var fallbackSrc = `https://dummyimage.com/${size}/e0e7ff/818cf8`;
      img.on('error', function () {
        img.attr('src', fallbackSrc);
      });
      img.attr('src', img.attr('src'));
    });


    $('[lindo-image-logo]').each(function () {
      var img = $(this);
      var fallbackSrc = `https://cdn.lindoai.com/image/placeholder-logo-${img.attr('lindo-image-logo')}.png`;
      img.on('error', function () {
        img.attr('src', fallbackSrc);
      });
      img.attr('src', img.attr('src'));

      img.click(function () {
        window.location.href = '/';
      });
      img.addClass('cursor-pointer');
    });

    $("[lindo-btn]").each(function () {

      var href = $(this).attr("href");
      $(this).css('cursor', 'pointer');

      // Check if href is a form service
      if (href?.startsWith("form:")) {
        // Get the form service and code from the href
        var formService = href.split(":")[1];
        var code = href.split(":")[2];

        // Remove href and add lindo-btn-form attribute with the appropriate value
        $(this).removeAttr("href").attr("lindo-btn-form", formService);

        // Add lindo-btn-code attribute with the code value, if it exists
        $(this).attr("lindo-btn-code", code);

        // Add script tag for the appropriate form service
        if (formService === "tally") {
          $(this).attr({
            'data-tally-open': code,
            'data-tally-layout': 'modal',
            'data-tally-width': '800'
          });
          $("head").append('<script src="https://tally.so/widgets/embed.js"></script>');
          // $(this).click(function (event) {
          //   event.preventDefault(); // Prevent default behavior
          //   // alert("test");
          //   Tally.openPopup(code);
          // });
        } else if (formService === "typeform") {
          $(this).attr({
            'data-tf-popup': code
          });
          $("head").append('<script src="https://embed.typeform.com/next/embed.js"></script>');
        } else if (formService === "calendly") {
          $("head").append('<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">');
          $("head").append('<script src="https://assets.calendly.com/assets/external/widget.js"></script>');
          $(this).click(function (event) {
            event.preventDefault(); // Prevent default behavior

            Calendly.initPopupWidget({ url: `https:${href.split(":")[3]}` });
          });
        } else if (formService === "calcom") {
          $(this).attr({
            'data-cal-link': code,
            'data-cal-config': '{"layout":"month_view"}',
            'href': '#'
          });
          (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
          Cal("init", { origin: "https://app.cal.com" });
          Cal("ui", { "styles": { "branding": { "brandColor": "#000000" } }, "hideEventTypeDetails": false, "layout": "month_view" });
        } else if (formService === "lmnsqz") {
          $(this).addClass('lemonsqueezy-button');
          $(this).attr('href', `https:${href.split(":")[3]}?embed=1`);
          $("body").append('<script src="https://assets.lemonsqueezy.com/lemon.js" lindo-app-script></script>');
        } else if (formService === "gumroad") {
          $(this).addClass('gumroad-button');
          $(this).attr('href', code);
          $("body").append('<script src="https://gumroad.com/js/gumroad.js"></script>');
        } else if (formService === "eventbrite") {
          $(this).attr('id', `eventbrite-widget-modal-trigger-${code}`);
          $(this).attr('href', `#`);

          $("body").append(`<script src="https://www.eventbrite.com/static/widgets/eb_widgets.js"></script>`);
          setTimeout(() => {
            window.EBWidgets.createWidget({
              widgetType: 'checkout',
              eventId: code,
              modal: true,
              modalTriggerElementId: `eventbrite-widget-modal-trigger-${code}`
            });
          }, 2000);
        }
      }
      // Check if href is a page link
      else if (href?.startsWith("page:")) {
        // Get the page link from the href
        var pageLink = href.split(":")[1];

        $(this).attr("href", `/${pageLink}`);
        $(this).on('click', function (e) {
          e.preventDefault();
          window.location.href = $(this).attr('href');
        });
      } else if (href?.startsWith("anchor:")) {
        $(this).on('click', function (e) {
          e.preventDefault();
          // Extract the section number from the href attribute
          const sectionNumber = parseInt(href.substring(7));

          // Find the corresponding section
          const targetSection = $('section[lindo-section]').eq(sectionNumber - 1);

          // Scroll to the target section
          $('html, body').animate({ scrollTop: targetSection.offset().top }, 500);
        });
      } else {
        try {
          const linkHost = new URL($(this).attr('href')).host;
          const currentHost = window.location.host;

          if (linkHost !== currentHost) {
            $(this).attr('target', '_blank');
          }
        } catch (e) {
          // The href was not a valid URL, so you can handle this case as needed
          console.warn("Invalid URL found:", $(this).attr('href'));
        }
      }
    }).click(function () {
      var category = 'cta'; // replace with your category
      var action = 'click'; // replace with your action
      var name = window.location.pathname; // replace with the name you want to track

      try {
        _paq.push(['trackEvent', category, action, name]);
      } catch (e) {
        console.log(e);
      }
    });

    // re-run animate
    // #WOW#

    $('[lindo-animate]').each(function () {
      const animate = $(this).attr('lindo-animate');
      $(this).removeClass('wow ' + animate);
      $(this).addClass('wow ' + animate);
    });

    try {
      wow = new WOW(
        {
          callback: function (box) {
            box.style.visibility = 'visible';
            box.style.opacity = '1';
          },
        }
      );
      wow.init();

    } catch (error) {
      console.log(error);
    }


    $('[lindo-checkbox]').on('change', function () {
      var value = $(this).attr('lindo-checkbox');

      if ($(this).is(':checked')) {
        $(`[lindo-checkbox-enable="${value}"]`).show();
        $(`[lindo-checkbox-disable="${value}"]`).hide();
      } else {
        $(`[lindo-checkbox-enable="${value}"]`).hide();
        $(`[lindo-checkbox-disable="${value}"]`).show();
      }
    });

    $('input[lindo-checkbox]').trigger('change');

    $('[lindo-icon]').each(function () {
      const name = $(this).attr('lindo-icon');
      const icons = _global_icons_config;
      if (icons?.[name]) {
        const icon = icons[name];
        $(this).removeClass(function (index, className) {
          return (className.match(/(^|\s)ti-\S+/g) || []).join(' ');
        });

        // Add the new class
        $(this).addClass('ti-' + icon);
      }
      $(this).removeClass('hidden');
    })

    const template_type = $('meta[name="lindo-page-setting"]')?.attr('template-type');
    if (template_type === 'Blog Post' || template_type === 'Article') {
      $('[lindo-scroll-top]').removeClass('hidden');
      $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
          $('[lindo-scroll-top]').removeClass('opacity-0').addClass('opacity-100');
        } else {
          $('[lindo-scroll-top]').removeClass('opacity-100').addClass('opacity-0');
        }
      });

      // Scroll to the top when the button is clicked
      $('[lindo-scroll-top]').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
        return false;
      });

    }

  }

  function getCookie(name) {
    var cookies = decodeURIComponent(document.cookie).split(';');
    for (var i = 0; i < cookies.length; i++) {
      var c = cookies[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  $.getJSON("/config.json", function (data) {
    if (!data.subscription) {
      addBadge();

      function check_expire(created_at){
        if (!created_at) return -1;
        const trial_end = new Date(created_at);
        trial_end.setDate(trial_end.getDate() + 14);
  
        const today = new Date();
  
        // Reset the time portions to compare just the dates
        trial_end.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
  
        return trial_end - today;
      }

      if(!data.date || check_expire(data.date) < 0){     
        $('body').append(`
        <div id="upgrade-your-website">
          <div class="fixed top-0 left-0 h-full w-full bg-black opacity-95 transition-opacity z-[900]"></div>
          <div class="fixed inset-0 top-32 sm:max-w-lg w-full mx-auto p-6 z-[910]">
            <div class="bg-white rounded-xl shadow-2xl dark:bg-slate-900 dark:shadow-black/[.7]">
              <div class="p-4 md:p-6 overflow-x-hidden overflow-y-auto">
                <h2 class="flex items-center gap-2 justify-center text-lg text-center sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  This website is deactivated <span class="inline-flex gap-2 items-center bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 text-transparent"><i class="ti ti-lock-square-rounded-filled text-3xl"></i></span></h2>
                <h4 class="text-base pt-6 font-normal text-center text-gray-800 dark:text-gray-200">
                  To activate it, the owner of the website needs to upgrade their Lindo Plan to <span class="font-bold inline-flex gap-2 items-center bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 text-transparent">Pro</span>
                </h4>
              </div>
              <div class="flex gap-4 border-t p-4 border-gray-200 divide-x divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
                <a lindo-age-19 class="w-full cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-2 rounded-xl font-medium bg-primary-500 text-white hover:opacity-90 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-blue-500 dark:hover:text-blue-500 dark:focus:ring-offset-gray-800" href="https://app.lindoai.com/billing">
                  Upgrade to Pro
                  <i class="ti ti-diamond-filled text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>`);        
      }
    }

    if (data.cookie && !getCookie('lindo_accept_cookie')) {
      $('body').append(`
      <div id="cookies-simple-with-dismiss-button" class="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[60] sm:max-w-5xl w-full mx-auto p-6">
      <div class="p-4 bg-white/[.6] backdrop-blur-lg shadow-2xl border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700">
        <div class="flex justify-between items-center gap-x-5 sm:gap-x-10">
          <span class="text-base text-gray-600 dark:text-gray-400">
            <span>By continuing to use this site you consent to the use of cookies in accordance with our </span>
            ${data.cookie === 'active' ? 'Cookies Policy.'
          : `
         <a class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium" href="${data.cookie}"> 
          Cookies Policy.
        </a>
          `}
          </span>
          <button lindo-accept-cookie type="button" class="inline-flex bg-gray-200 rounded-full p-3 text-gray-500 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-400" data-hs-remove-element="#cookies-simple-with-dismiss-button">
            <span>Accept</span>
          </button>
        </div>
      </div>
    </div>
`);

      $('[lindo-accept-cookie]').click(function () {
        var date = new Date();
        date.setFullYear(date.getFullYear() + 1); // Cookie expires in 1 year
        document.cookie = "lindo_accept_cookie=1; expires=" + date.toUTCString() + "; path=/";
      });
    }

    if (data.age && !getCookie('lindo_age_gate')) {
      $('body').append(`
      <div id="age-verification-with-dismiss-button">
      <div class="fixed top-0 left-0 h-full w-full bg-black opacity-95 transition-opacity z-[900]"></div>
      <div class="fixed inset-0 top-32 sm:max-w-lg w-full mx-auto p-6 z-[910]">
        <div class="bg-white rounded-xl shadow-2xl dark:bg-slate-900 dark:shadow-black/[.7]">
    
          <div class="p-4 md:p-6 overflow-x-hidden overflow-y-auto">
            <h2 class="text-lg text-center sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Welcome to our website
            </h2>
            <h4 class="text-base pt-6 font-normal text-center text-gray-800 dark:text-gray-200">
              Please, verify your age to enter.
            </h4>
          </div>
    
          <div class="flex gap-4 border-t p-4 border-gray-200 divide-x divide-gray-200 dark:border-gray-700 dark:divide-gray-700">
            <a lindo-age-gate class="w-full cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-2 rounded-xl font-medium bg-primary-500 text-white hover:opacity-90 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-blue-500 dark:hover:text-blue-500 dark:focus:ring-offset-gray-800" data-hs-remove-element="#age-verification-with-dismiss-button">
              I am over ${data.age}
            </a>
            <a class="w-full border cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-2 rounded-xl font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 transition-all text-sm sm:p-4 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800" href="#">
              I am under ${data.age}
            </a>
          </div>
        </div>
      </div>
    </div>
`);

      $('[lindo-age-gate]').click(function () {
        var date = new Date();
        date.setFullYear(date.getFullYear() + 1); // Cookie expires in 1 year
        document.cookie = "lindo_age_gate=1; expires=" + date.toUTCString() + "; path=/";
      });
    }

    if (stage === "prod" && !queryParams.get('data') && !getCookie('lindo_ignore_tracking'))
      $('body').append(data.tracking_id2 ?`
      <script>
      var _mtm = window._mtm = window._mtm || [];
      _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.async=true; g.src='https://tracking2.lindoai.com/js/container_${data.tracking_id2}.js'; s.parentNode.insertBefore(g,s);
      </script>
  ` :  `
    <script>
    var _mtm = window._mtm = window._mtm || [];
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src='https://tracking.lindoai.com/js/container_${data.tracking_id}.js'; s.parentNode.insertBefore(g,s);
    </script>
`);

    $('[lindo-setting-global]').each(function () {
      var type = $(this).attr('lindo-setting-global');
      if (data[type]) {
        $(this).attr("href", data[type]);
        $(this).attr("target", "_blank");
      } else {
        $(this).hide();
      }
    });

  }).fail(function () {
    // alert("Error loading config.json");
    addBadge()
  });

  if (queryParams.get('disable_tracking')) {
    var date = new Date();
    date.setFullYear(date.getFullYear() + 1); // Cookie expires in 1 year
    document.cookie = "lindo_ignore_tracking=; expires=" + date.toUTCString() + "; path=/";
  }
});

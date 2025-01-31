function UwuInlineScript() {
  try {
    let logShown = false;
    function setUwu(isUwu) {
      try {
        if (isUwu) {
          localStorage.setItem('uwu', true);
          document.documentElement.classList.add('uwu');
          if (!logShown) {
            console.log('uwu mode! turn off with ?uwu=0');
            console.log(
              'logo credit to @sawaratsuki1004 via https://github.com/SAWARATSUKI/ServiceLogos'
            );
            logShown = true;
          }
        } else {
          localStorage.removeItem('uwu');
          document.documentElement.classList.remove('uwu');
          console.log('uwu mode off. turn on with ?uwu');
        }
      } catch (err) {}
    }
    window.__setUwu = setUwu;
    function checkQueryParam() {
      const params = new URLSearchParams(window.location.search);
      const value = params.get('uwu');
      switch (value) {
        case '':
        case 'true':
        case '1':
          return true;
        case 'false':
        case '0':
          return false;
        default:
          return null;
      }
    }
    function checkLocalStorage() {
      try {
        return localStorage.getItem('uwu') === 'true';
      } catch (err) {
        return false;
      }
    }
    const uwuQueryParam = checkQueryParam();
    if (uwuQueryParam != null) {
      setUwu(uwuQueryParam);
    } else if (checkLocalStorage()) {
      document.documentElement.classList.add('uwu');
    }
  } catch (err) {}
}

export function UwuScript() {
  return (
    <script
      id="uwu-script"
      dangerouslySetInnerHTML={{
        __html: `(${UwuInlineScript.toString()})()`,
      }}
    />
  );
}

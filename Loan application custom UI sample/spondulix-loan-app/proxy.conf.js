const PROXY_CONFIG = [{
        context: [
            "/preview/"
        ],
        target: "http://localhost:8888/",
        secure: false,
        changeOrigin: true,
        logLevel: "info"
    }, {
        context: [
            "/bpm/"
        ],
        "target": "http://ace-nightly-test.emea.tibco.com/",
        "changeOrigin": true,
        "secure": false,
        "logLevel": "debug"
    }
    , {
        context: [
            "/apps/bpm-forms/"
        ],
        "target": "http://ace-nightly-test.emea.tibco.com/",
        "changeOrigin": true,
        "secure": false,
        "logLevel": "debug"
    },
    {
        context: [
            "/bpmresources/"
        ],
        "target": "http://ace-nightly-test.emea.tibco.com/",
        "changeOrigin": true,
        "secure": false,
        "logLevel": "debug"
    }
]
module.exports = PROXY_CONFIG;
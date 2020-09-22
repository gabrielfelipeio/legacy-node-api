var VCAP_LOCAL = {
    "compose-for-mongodb": [{
        "name": "MDB-PJ002",
        "instance_name": "MDB-PJ002",
        "binding_name": null,
        "credentials": {
            "db_type": "mongodb",
            "maps": [],
            "instance_administration_api": {
                "instance_id": "6509da55-3d9e-4183-a30e-38d2fd85ce85",
                "root": "https://composebroker-dashboard-public.mybluemix.net/api",
                "deployment_id": "5c76fb6f91ba7247213ed171"
            },
            "name": "bmix-dal-yp-6509da55-3d9e-4183-a30e-38d2fd85ce85",
            "uri_cli": "mongo --ssl --sslAllowInvalidCertificates portal-ssl597-50.bmix-dal-yp-6509da55-3d9e-4183-a30e-38d2fd85ce85.2156681883.composedb.com:18067/compose -u admin -p SQMLXSAFZSAUTREG --authenticationDatabase admin",
            "deployment_id": "5c76fb6f91ba7247213ed171",
            "uri": "mongodb://admin:SQMLXSAFZSAUTREG@portal-ssl597-50.bmix-dal-yp-6509da55-3d9e-4183-a30e-38d2fd85ce85.2156681883.composedb.com:18067,portal-ssl583-51.bmix-dal-yp-6509da55-3d9e-4183-a30e-38d2fd85ce85.2156681883.composedb.com:18067/compose?authSource=admin&ssl=true"
        },
        "syslog_drain_url": null,
        "volume_mounts": [],
        "label": "compose-for-mongodb",
        "provider": null,
        "plan": "Standard",
        "tags": [
            "database",
            "big_data",
            "data_management",
            "ibm_created",
            "ibm_dedicated_public",
            "eu_access"
        ]
    }],
    URL_API_SERVICES: 'https://elawlab-api-services.elaw.com.br/api/extractText',
    URL_BILLINGS: "https://elawlab-billings.mybluemix.net/api/Billings/returnDatas",
    TIME_EXPORT_BILLINGS: 21600000,
    TIME_RETURN_BILLINGS: 21600000
};

module.exports = VCAP_LOCAL;
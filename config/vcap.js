var VCAP_LOCAL = {
    "compose-for-mongodb": [{
        "name": "MDB-WEBHOOKS",
        "instance_name": "MDB-WEBHOOKS",
        "binding_name": null,
        "credentials": {
            "db_type": "mongodb",
            "maps": [],
            "instance_administration_api": {
                "instance_id": "e0123e45-4100-4e51-ad19-87f4a2e56ff6",
                "root": "https://composebroker-dashboard-public.mybluemix.net/api",
                "deployment_id": "5d499bfd22caf87b72cdc414"
            },
            "name": "bmix-dal-yp-e0123e45-4100-4e51-ad19-87f4a2e56ff6",
            "uri_cli": "mongo --ssl --sslAllowInvalidCertificates portal-ssl1038-47.bmix-dal-yp-e0123e45-4100-4e51-ad19-87f4a2e56ff6.2156681883.composedb.com:20434/compose -u admin -p IYEMPRNPIALWTKTU --authenticationDatabase admin",
            "deployment_id": "5d499bfd22caf87b72cdc414",
            "uri": "mongodb://admin:IYEMPRNPIALWTKTU@portal-ssl1038-47.bmix-dal-yp-e0123e45-4100-4e51-ad19-87f4a2e56ff6.2156681883.composedb.com:20434,portal-ssl1029-42.bmix-dal-yp-e0123e45-4100-4e51-ad19-87f4a2e56ff6.2156681883.composedb.com:20434/compose?authSource=admin&ssl=true"
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
    }]
};

module.exports = VCAP_LOCAL;
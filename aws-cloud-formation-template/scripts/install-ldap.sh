#!/bin/bash
#
# Copyright © 2021. TIBCO Software Inc.
# This file is subject to the license terms contained
# in the license file that is distributed with this file.
#

#
# First thing check if we have run before, and set up logging ...
#
export amxlogfile="/opt/tibco/ldap-install.log"
function do_log {
    echo "$(date '+%d/%m/%Y %H:%M:%S') $@" >> "$amxlogfile"
}


#
# Now check if we've already run this script and quit if we have
#
if [ -f "$amxlogfile" ]
then
    do_log "$0 script re-run attempt."
    exit 0
fi


#
# Create the log file and set it's owner as "tibuser"
#
do_log "$0 - executed - installing LDAP server"


#
# Load the environment with the installation parameters
#
. /opt/tibco/ldap-install.env
do_log "Environment loaded : AWS Region = $OURAWS_REGION"


# Obtain the passwords from the parameter store
LDAPCloudAdmin=`aws ssm get-parameters --region $OURAWS_REGION --names $LDAP_PASSWDID --with-decryption`
LDAPCloudDS=`aws ssm get-parameters --region $OURAWS_REGION --names $LDAPDS_PASSWDID --with-decryption`
LDAPCloudAdminPassword=`echo "$LDAPCloudAdmin" | jq -r .Parameters[].Value`
LDAPCloudDSPassword=`echo "$LDAPCloudDS" | jq -r .Parameters[].Value`
do_log "Obtained the following secrets - LDAPCloudAdmin = $LDAPCloudAdmin  LDAPCloudDS = $LDAPCloudDS"


#
# Now complete the IPA server install
#
BPMLDAPDomainName=$LDAP_DOMSTR
do_log "About to install IPA Server - command : ipa-server-install --realm=${BPMLDAPDomainName^^} --domain=$BPMLDAPDomainName --ds-password=$LDAPCloudDSPassword --admin-password=$LDAPCloudAdminPassword --hostname=$LDAP_CLOUDHOST.$CLOUD_DOMAIN --unattended"
export SUCCESS_FLAG=true
ipa-server-install --realm=${BPMLDAPDomainName^^} --domain=$BPMLDAPDomainName --ds-password=$LDAPCloudDSPassword --admin-password=$LDAPCloudAdminPassword --hostname=$LDAP_CLOUDHOST.$CLOUD_DOMAIN --unattended
ldap_install_rc=$?
if [ "$ldap_install_rc" -ne "0" ]
then
	SUCCESS_FLAG=false
fi
do_log "ipa-server Software install complete. Success = $SUCCESS_FLAG ( $ldap_install_rc )"


#
# Finally, signal back to AWS that the setup is complete
# IMPORTANT NOTE: the actual signal command is added by the user-data script
# to the end of this script. Success/failure is signaled by value of the
# SUCCESS_FLAG environment variable (true/false)
#
do_log "Signalling AWS that this stack has completed"

# About
This POC is an attempt to prove that it is (or isn't) possible to dynamically provision a Quick Links web part in a PnP Provisionign template. 

The basic idea is to pull a list of links from a site collection that represents a "Division Hub", pass the list items into the template as variables, and 
then have PnP Provision the web part with the correct set of links.

In order to prove that this works, the process should
1. Pull two list items from https://wchdev.sharepoint.com/teams/GSS-Division-B/Lists/AgencySites
2. Pass the two list items into a call for "Apply-PnPProvisioningTemplate"
3. Apply the template to this site - https://wchdev.sharepoint.com/sites/GSS-QuickLinksPOC
4. The home page should include a QL web part with the two links from step 1.
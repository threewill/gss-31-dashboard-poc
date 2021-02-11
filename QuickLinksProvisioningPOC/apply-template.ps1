BEGIN{
    Connect-PnPOnline -Url https://wchdev.sharepoint.com/teams/GSS-Division-B -Credentials WCHDEVO365
}
PROCESS{
    # Get Links
    $agencyLinks = Get-PnPListItem -List lists/AgencySites

    # Format into variables
    $agencyItems = [string]::Empty
    $agencyTitles = [string]::Empty
    $agencyUrls = [string]::Empty
    
    for($i = 0; $i -lt $agencyLinks.count; $i++){
        $title = $agencyLinks[$i]["Title"] -replace "&", "&amp;" -replace '"', "&quot;"
        $url = $agencyLinks[$i]["URL"] -replace "&", "&amp;" -replace '"', "&quot;"
        if($i -gt 0){
            $agencyItems += ","
        }
        $agencyItems += "{&quot;sourceItem&quot;:{&quot;itemType&quot;:2,&quot;fileExtension&quot;:&quot;&quot;,&quot;progId&quot;:&quot;&quot;},&quot;thumbnailType&quot;:2,&quot;id&quot;:$($i + 1),&quot;description&quot;:&quot;&quot;,&quot;altText&quot;:&quot;&quot;,&quot;rawPreviewImageMinCanvasWidth&quot;:32767}"
        $agencyTitles += ",&quot;items[$i].title&quot;:&quot;$title&quot;"
        $agencyUrls += ",&quot;items[$i].sourceItem.url&quot;:&quot;$url&quot;"
    }
    $xml = Get-Content -Path $PSScriptRoot/GSS-User-2-homepage.xml -Raw
    $xml = $xml -replace "{parameter:AgencyItems}", $agencyItems -replace "{parameter:AgencyTitles}", $agencyTitles -replace "{parameter:AgencyUrls}", $agencyUrls
    $template = Read-PnPProvisioningTemplate -Xml $xml

    # Apply Template w/ Variables
    Connect-PnPOnline -Url https://wchdev.sharepoint.com/sites/GSS-QuickLinksPOC -Credentials WCHDEVO365
    
    # Apply-PnPProvisioningTemplate -Path "$PSScriptRoot/GSS-User-2-homepage.xml" -Parameters @{ "AgencyItems" = $agencyItems; "AgencyTitles" = $agencyTitlesEscaped; "AgencyUrls" = $agencyUrlsEscaped }
    Apply-PnPProvisioningTemplate -InputInstance $template
}
END{

}
<#assign el=args.htmlid?html>
<div id="${el}-dialog" class="depot-casier">
   <div id="${el}-dialogTitle" class="hd"><#if displayName??>${msg("", displayName)}<#else>${msg("")}</#if></div>
   <div class="bd">
     <form id="${el}-form" action="" method="post">
     	<input type="hidden" name="nodeRef" id="${el}-nodeRef" value="${nodeRef}" />
	 	<input type="hidden" name="document" id="${el}-document" value="${nodeRef}" />
	 	<input type="hidden" name="pathNodeRef" id="${el}-pathNodeRef" />
	 	<#if multiple == false>
	 		<input type="hidden" name="multiple" id="${el}-multiple" value="false"/>
	 	<#else>
	 		<input type="hidden" name="multiple" id="${el}-multiple" value="true"/>
        </#if>
		<#--
         <div class="yui-gd">
        	<div class="yui-u first"><label for="${el}-overwrite">${msg("")}:</label></div>
        	<div class="yui-u"><input type="checkbox" name="overwrite" id="${el}-overwrite" value="true"></div>
     	 </div>
         <div class="yui-gd">
            <div class="yui-u first"><label for="${el}-xxx">${msg("xxx")}:</label></div>
            <div class="yui-u"><input type="checkbox" name="xxx" id="${el}-xxx" value="true"></div>
         </div>
		 -->
	 	 <div class="bdft">
	    	<input type="submit" id="${el}-ok" value="${msg("button.ok")}" tabindex="0" />
	    	<input type="button" id="${el}-cancel" value="${msg("button.cancel")}" tabindex="0" />
	 	 </div>
     </form>
   </div>
</div>


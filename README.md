# Alfresco Bulk Export Tool and "Import/Export ACP Tool" for Alfresco Share #

===============================================
### Alfresco Bulk Import Tool v2.x - for Alfresco v5.0 and up 
===============================================

### Project deprecated in favor of <a href="https://github.com/Alfresco/alfresco-bulk-export">Alfresco/alfresco-bulk-export</a> but it's seem not supported

A bulk filesystem export tool for the open source [Alfresco](http://www.alfresco.com) CMS.

This module has as main objective provides a simple way to export Alfresco storaged content (with properties) to a file system.  To start this system is used a simple HTTP/GET call to a webscript that just can be initialized by system administrator.

The format of filesystem choosed is described by Alfresco Bulk filesystem import, that can be found in [Bulk Import Project Page](https://github.com/pmonks/alfresco-bulk-import/wiki).

A smal detail that need to be mencioned is the fact that file exportion will be done in server machine (even called by remote machine), else,  you also can map a remote directory in the server end export content to there.

Please don't hesitate to contact the project owner if you'd like to contribute!

# Prerequisites #
Please make sure you are running a version of Alfresco that the tool has been developed for. As of the time of writing, the tool has been tested on alfresco 5.0, it should work on Alfresco v4.0+. The tool uses Java 1.7 features so will not work on versions of alfresco that do not support at least java 1.7.

# Installation Steps #
The following steps describe how to download and install the Alfresco Bulk Filesystem Import Tool:

  1. Download the latest AMP file containing the tool from [Release](https://github.com/vprince1/alfresco-bulk-export/releases)
  2. Shutdown your Alfresco instance
  3. Make a backup of the original alfresco.war file. On Tomcat, this is located in ${ALFRESCO\_HOME}/tomcat/webapps
  4. Use the Alfresco [Module Management Tool](http://wiki.alfresco.com/wiki/Module_Management_Tool) to install the AMP file obtained in step 1
  5. Restart Alfresco, watching the log carefully for errors

# Usage #
Alfresco bulk export can be used using the the webscript UI or a webscript without a UI
# Method 1 - UI webscript #
The following URL can be used to access the UI webscript
http://{host}:{port}/alfresco/service/extensions/bulkexport/export

where:
* **{host}:** is the host of your instalation.
* **{port}:** is the port used by Alfresco.

The UI should look as follows
![image](https://user-images.githubusercontent.com/11996632/30759019-cb40fef8-9f91-11e7-9178-b35c088438b6.png)

* Folder NodeRef: The noderef of the folder you would like to export. This field or the 'From Date' field is required
* Output folder: The full folder path where the nodes will be exported
* From Date: The nodes modifed after the given value will be exported. This field or the 'Folder Noderef' need to be provided. The date format example is 2017-03-01T00:00:00
* To Date: The nodes modifed before the given value will be exported. The date format example is 2017-03-01T00:00:00
* Add aspects: This is used to inject custom aspects to the exported nodes. You can specify multiple aspects like my:migrationAspect,my:testAspect. This is helpful if you want to keep track of nodes that are migrated by adding a custom aspect.
* Add properties: Custom properties can be injected. Example: my:sourceSystem=testserver,my:sourceSystemName=cm:name
* Update existing model data: Existing types, aspects and properties can be updated. Example: my:prop1=mynew:prop2,my:type1=mynew:type1
* Update model prefix: The model prefixes can be updated. Example: oldprefix=newprefix,acme=newacme
* Ignore Exported: Checked means existing files will not be replaced
* Export Versions: Checked means all versions of the node will be exported
* Revision Head: Checked and export version is set to true means the head version will be numbered. Unchecked results in the default numbering scheme
* Use Node Cache: Checked means the list of nodes are cached to the 'Output Folder'. This is list will be used for export.

# Method 2 - Webscript #
This module is started by a simple webscript call. To initiate the exportation you just use this URL in a browser:

http://{host}:{port}/alfresco/service/extensions/bulkexport/export?nodeRef={NodeRef}&base={base}&ignoreExported={ignoreExported?}&exportVersions={exportVersions}&revisionHead={revisionHead}&useNodeCache={useNodeCache}&cancel={cancel}

where:
* **{host}:** is the host of your installation.
* **{port}:** is the port used by Alfresco.
* **{noderef}:** is an Alfresco node reference that you want to export. Like:
   _workspace://`SpacesStore`/c494aff5-bedf-40fa-8d0d-2aebcd583579_
* **{base}:** is a base path of your target folder (in the Alfresco Server). Like: _/home/gsdenys/export_ or _C:/export_.
* **{ignoreExported?}:** parameter **optional**. when it is true, the system will ignore all Alfresco nodes already exported. The default is _false_.
* exportVersion if true exports all revisions of a node - parameter **optional**, The default is _false_.
* revisionHead if true (and exportVersion=true) then files are exported with head (latest) revision numbered, if set to false then the default numbering scheme used by the Alfresco Bulk Import tool is used (head revision is not numbered) - parameter **optional**, only used if exportVersion set, The default is _false_.
* useNodeCache if true then a list of nodes to export is cached to the export area for future repeated use. Sometimes useful for large exports of data due to the transaction cache being full - parameter **optional**, The default is _false_.
* nbOfThreads number of threads in the thread pool if none is given the default value is 1
* exportChunkSize is the number of Nodes handled by each Task iteration. Default value is 10
* **{cancel}:** is the job id that needs to be stopped. The job id will be the noderef of the folder or the 'from date' value.

When the export is ended you will see in browser a message _"Process finished Successfully"_. Once this message is printed, look-up your content in the Alfresco Server in the {base} directory.

The exporter will write progress to the Alfresco Log file as well as any issues it may have. Issues will also be reported on the web interface.

# Installation Steps #
The following steps describe how to download and install the Alfresco Bulk Filesystem Import Tool:

  1. Download the latest AMP file containing the tool from [Release](https://github.com/gsdenys/alfresco-bulk-export/releases)
  2. Shutdown your Alfresco instance
  3. Make a backup of the original alfresco.war file. On Tomcat, this is located in ${ALFRESCO\_HOME}/tomcat/webapps
  4. Use the Alfresco [Module Management Tool](http://wiki.alfresco.com/wiki/Module_Management_Tool) to install the AMP file obtained in step 1
  5. Restart Alfresco, watching the log carefully for errors

# Logging #
The plugin uses the standard alfresco log4j mechanism, the following modules are configured in the amp to the following values:
log4j.logger.org.alfresco.extensions.bulkexport.controler.Engine=INFO
log4j.logger.org.alfresco.extensions.bulkexport.dao.AlfrescoExportDaoImpl=ERROR
log4j.logger.org.alfresco.extensions.bulkexport.model.FileFolder=ERROR
log4j.logger.org.alfresco.extensions.bulkexport.Export=INFO

===============================================
### "Import/Export ACP Tool" for Alfresco Share
===============================================

This extension allows you to **import** and **export** ACP files from Share UI (you can also import (and extract) ZIP files).  

Building the module
-------------------
Check out the project if you have not already done so 

        git clone git://github.com/atolcd/alfresco-share-import-export.git

An Ant build script is provided to build JAR file **OR** AMP files containing the custom files.  

To build JAR file, run the following command from the base project directory:

        ant dist-jar

If you want to build AMP files, run the following command:

        ant dist-amp


Installing the module
---------------------
This extension is a standard Alfresco Module, so experienced users can skip these steps and proceed as usual.

### 1st method: Installing JAR (recommended)
1. Stop Alfresco
2. Copy `share-import-export-X.X.X.jar` into the `/tomcat/shared/lib/` folder of your Alfresco (you might need to create this folder if it does not already exist).
3. Start Alfresco


### 2nd method: Installing AMPs
1. Stop Alfresco
2. Use the Alfresco [Module Management Tool](http://wiki.alfresco.com/wiki/Module_Management_Tool) to install the modules in your Alfresco and Share WAR files:

        java -jar alfresco-mmt.jar install import-export-alfresco-vX.X.X.amp $TOMCAT_HOME/webapps/alfresco.war -force
        java -jar alfresco-mmt.jar install import-export-share-vX.X.X.amp $TOMCAT_HOME/webapps/share.war -force

3. Delete the `$TOMCAT_HOME/webapps/alfresco/` and `$TOMCAT_HOME/webapps/share/` folders.  
**Caution:** please ensure you do not have unsaved custom files in the webapp folders before deleting.
4. Start Alfresco



Using the module
---------------------
Go to the Share Admin console.  
Export tool (ACP only): `http://server:port/share/page/console/admin-console/export`  
Import tool (ACP and ZIP files): `http://server:port/share/page/console/admin-console/import`  


LICENSE
---------------------
This extension is licensed under `GNU Library or "Lesser" General Public License (LGPL)`.  
Created by: [Julien BERTHOUX] (https://github.com/jberthoux) and [Bertrand FOREST] (https://github.com/bforest)  


Our company
---------------------
[Atol Conseils et D�veloppements] (http://www.atolcd.com) is Alfresco [Gold Partner] (http://www.alfresco.com/partners/atol)  
Follow us on twitter [ @atolcd] (https://twitter.com/atolcd)  

# History #

## 2019-06-13 MERGED FUNCTIONALITY FOR ACP FROM (https://github.com/atolcd/alfresco-share-import-export/network/members)
## 2019-06-24 MERGED FUNCTIONALITY FROM VPrince FORK (https://github.com/vprince1/alfresco-bulk-export)

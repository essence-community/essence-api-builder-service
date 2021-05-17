cd %~dp0
call liquibase\liquibase --defaultsFile=liquibase.properties --changeLogFile=db.changelog.xml update >> main.log
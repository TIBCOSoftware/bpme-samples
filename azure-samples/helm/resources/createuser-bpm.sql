CREATE USER [%bpmuser_username%] FOR LOGIN [%bpmuser_username%] WITH DEFAULT_SCHEMA = [%dbname%]
GO


EXEC( 'CREATE SCHEMA [%dbname%] AUTHORIZATION [%bpmuser_username%]' )
GO

-- Add the user and configure
exec sp_addrolemember 'db_ddladmin', '%bpmuser_username%'
GO

exec sp_addrolemember 'db_datareader', '%bpmuser_username%'
GO

exec sp_addrolemember 'db_datawriter', '%bpmuser_username%'
GO

exec sp_addrolemember 'db_owner', '%bpmuser_username%'
GO

-- Gives user ability control the DBO schema
GRANT CONTROL ON SCHEMA::dbo TO [%bpmuser_username%] WITH GRANT OPTION
GO

-- Needed to execute showplan
GRANT SHOWPLAN TO [%bpmuser_username%]
GO

-- Needed to manipulate application roles
GRANT ALTER ANY APPLICATION ROLE TO [%bpmuser_username%]
GO

-- Needed to manipulate roles
GRANT ALTER ANY ROLE TO [%bpmuser_username%]
GO

-- Needed to view definitions of objects
GRANT VIEW DEFINITION TO [%bpmuser_username%]
GO

-- Needed to create schemas
GRANT CREATE SCHEMA TO [%bpmuser_username%]
GO

-- Needed for database-level DMVs
GRANT VIEW DATABASE STATE TO [%bpmuser_username%]
GO

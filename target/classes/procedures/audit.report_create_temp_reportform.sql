CREATE OR REPLACE FUNCTION audit.report_create_temp_reportform()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
BEGIN
   DROP TABLE IF EXISTS TEMP_REPORTFORM CASCADE;
   CREATE  TEMPORARY TABLE TEMP_REPORTFORM
    (
      CHAR1   VARCHAR(1000 ),
      CHAR2   VARCHAR(1000 ),
      CHAR3   VARCHAR(1000 ),
      CHAR4   VARCHAR(1000 ),
      CHAR5   VARCHAR(1000 ),
      CHAR6   VARCHAR(1000 ),
      CHAR7   VARCHAR(1000 ),
      CHAR8   VARCHAR(1000 ),
      CHAR9   VARCHAR(1000 ),
      CHAR10  VARCHAR(1000 ),
      CHAR11  VARCHAR(1000 ),
      CHAR12  VARCHAR(1000 ),
      CHAR13  VARCHAR(1000 ),
      CHAR14  VARCHAR(1000 ),
      CHAR15  VARCHAR(1000 ),
      CHAR16  VARCHAR(1000 ),
      CHAR17  VARCHAR(1000 ),
      CHAR18  VARCHAR(1000 ),
      CHAR19  VARCHAR(1000 ),
      CHAR20  VARCHAR(1000 ),
      CHAR21  VARCHAR(1000 ),
      CHAR22  VARCHAR(1000 ),
      CHAR23  VARCHAR(1000 ),
      CHAR24  VARCHAR(1000 ),
      CHAR25  VARCHAR(1000 ),
      CHAR26  VARCHAR(1000 ),
      CHAR27  VARCHAR(1000 ),
      CHAR28  VARCHAR(1000 ),
      CHAR29  VARCHAR(1000 ),
      CHAR30  VARCHAR(1000 ),
      CHAR31  VARCHAR(1000 ),
      CHAR32  VARCHAR(1000 ),
      CHAR33  VARCHAR(1000 ),
      CHAR34  VARCHAR(1000 ),
      CHAR35  VARCHAR(1000 ),
      CHAR36  VARCHAR(1000 ),
      CHAR37  VARCHAR(1000 ),
      CHAR38  VARCHAR(1000 ),
      CHAR39  VARCHAR(1000 ),
      CHAR40  VARCHAR(1000 ),
      CHAR41  VARCHAR(1000 ),
      CHAR42  VARCHAR(1000 ),
      CHAR43  VARCHAR(1000 ),
      CHAR44  VARCHAR(1000 ),
      CHAR45  VARCHAR(1000 ),
      CHAR46  VARCHAR(1000 ),
      CHAR47  VARCHAR(1000 ),
      CHAR48  VARCHAR(1000 ),
      CHAR49  VARCHAR(1000 ),
      CHAR50  VARCHAR(1000 ),
      NUM1    NUMERIC,
      NUM2    NUMERIC,
      NUM3    NUMERIC,
      NUM4    NUMERIC,
      NUM5    NUMERIC,
      NUM6    NUMERIC,
      NUM7    NUMERIC,
      NUM8    NUMERIC,
      NUM9    NUMERIC,
      NUM10   NUMERIC,
      NUM11   NUMERIC,
      NUM12   NUMERIC,
      NUM13   NUMERIC,
      NUM14   NUMERIC,
      NUM15   NUMERIC,
      NUM16   NUMERIC,
      NUM17   NUMERIC,
      NUM18   NUMERIC,
      NUM19   NUMERIC,
      NUM20   NUMERIC,
      DATE1   TIMESTAMP,
      DATE2   TIMESTAMP,
      DATE3   TIMESTAMP,
      DATE4   TIMESTAMP,
      DATE5   TIMESTAMP
    )
    ON COMMIT PRESERVE ROWS;
END;
$function$

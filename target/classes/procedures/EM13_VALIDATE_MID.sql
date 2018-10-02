CREATE OR REPLACE FUNCTION audit.EM13_VALIDATE_MID(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
declare
  po_cursor                   REFCURSOR;
BEGIN
	 OPEN po_cursor FOR
	 	SELECT COUNT(1) AS midDup
		FROM box_profile	
		WHERE i_mid_id = pi_mid::NUMERIC ;
  RETURN po_cursor;
END
$function$

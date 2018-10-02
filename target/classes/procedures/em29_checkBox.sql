CREATE OR REPLACE FUNCTION audit.em29_checkBox(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor         REFCURSOR;
  v_validate        NUMERIC  := 0;
BEGIN
		OPEN po_cursor FOR
        SELECT count(1)
        FROM box_profile
        WHERE i_mid_id = pi_mid:: NUMERIC;
        
        RETURN po_cursor;
END;
$function$
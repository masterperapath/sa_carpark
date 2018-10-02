CREATE OR REPLACE FUNCTION audit.em22_save_gprsserver_out(pi_mid character varying, pi_command character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
    po_cursor         refcursor;
	v_validate        NUMERIC(15)  := 0;
BEGIN
    SELECT count(1)
	INTO v_validate
	FROM box_profile
	WHERE i_mid_id = pi_mid:: NUMERIC;
   
    IF v_validate = 0 :: NUMERIC THEN
	
	OPEN po_cursor FOR SELECT 1 AS checkmid;
    RETURN po_cursor;

	ELSE
	INSERT INTO gprsserver_out(recipient, message)
           VALUES (pi_mid::numeric , pi_command);

    RETURN audit.em22_search_gprsserver_out(pi_mid);

	END IF;
END;
$function$

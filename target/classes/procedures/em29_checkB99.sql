CREATE OR REPLACE FUNCTION audit.em29_checkB99(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor         REFCURSOR;
BEGIN
		OPEN po_cursor FOR
        SELECT count(1)
        FROM config_receiver_expansion
        WHERE i_mid_id = pi_mid:: NUMERIC
        AND c_cre_entry_code LIKE 'A71';
        
        RETURN po_cursor;
END;
$function$
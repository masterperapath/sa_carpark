CREATE OR REPLACE FUNCTION audit.select_em17_detail(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
    SELECT b_acc_with_voltage, i_acc_voltage
FROM config_receiver
WHERE i_mid_id = pi_mid ::NUMERIC; 
   
RETURN po_cursor;
END
$function$
CREATE OR REPLACE FUNCTION audit.update_shipment_status(pi_mid character varying, pi_status_dlt boolean)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
	po_cursor refcursor;
BEGIN
    UPDATE config_receiver               
     SET b_hide_from_dlt = pi_status_dlt
    WHERE i_mid_id = CAST(pi_mid AS NUMERIC);

  	RETURN audit.select_status(pi_mid);
END;
$function$
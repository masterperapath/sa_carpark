CREATE OR REPLACE FUNCTION audit.update_em17_detail(pi_mid character varying, pi_status character varying, pi_speed character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN

    UPDATE config_receiver
  	SET  i_acc_voltage  =  pi_speed :: NUMERIC
  	   , b_acc_with_voltage = pi_status :: BOOLEAN
		WHERE i_mid_id =  pi_mid ::NUMERIC;
		
RETURN audit.select_em17_detail(pi_mid);
END
$function$
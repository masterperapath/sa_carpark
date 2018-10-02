CREATE OR REPLACE FUNCTION audit.update_databazzer_eyemin(pi_mid character varying, pi_speed character varying, pi_status character varying, pi_pin character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
 po_cursor refcursor;
BEGIN
    IF pi_pin IS NULL
	then
	update config_receiver 
     set b_spd_op1_on = pi_status::BOOLEAN
 	  , i_spd_alert_1 = pi_speed::NUMERIC
    where  i_mid_id = pi_mid::NUMERIC;
   
    ELSE
    update box_profile
    set  i_pin_code = pi_pin::NUMERIC
    where i_mid_id = pi_mid::NUMERIC;
 
    update config_receiver 
    set b_spd_op1_on = pi_status::BOOLEAN
 	  , i_spd_alert_1 = pi_speed::NUMERIC
    where  i_mid_id = pi_mid::NUMERIC;
    END IF;
   RETURN audit.select_buzzer_eyemin(pi_mid);
END;
$function$

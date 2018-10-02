CREATE OR REPLACE FUNCTION audit.update_databazzer(pi_mid character varying, pi_speed character varying, pi_status character varying, pi_speedinput2 character varying, pi_statusinput2 character varying, pi_pin character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
 po_cursor refcursor;
BEGIN
    IF pi_pin IS NULL
	THEN
	UPDATE config_receiver 
    SET b_spd_op1_on = pi_status::BOOLEAN
 	  , i_spd_alert_1 = pi_speed::numeric
 	  , b_spd_op2_on = pi_statusInput2::BOOLEAN
 	  , i_spd_alert_2 = pi_speedInput2::NUMERIC
    WHERE  i_mid_id = pi_mid::NUMERIC;
   
    ELSE
    UPDATE box_profile
    SET  i_pin_code = pi_pin::NUMERIC
    WHERE i_mid_id = pi_mid::NUMERIC;
 
    UPDATE config_receiver 
    SET b_spd_op1_on = pi_status::BOOLEAN
 	  , i_spd_alert_1 = pi_speed::numeric
 	  , b_spd_op2_on = pi_statusInput2::BOOLEAN
 	  , i_spd_alert_2 = pi_speedInput2::NUMERIC
    WHERE  i_mid_id = pi_mid::NUMERIC;
    END IF;
   RETURN audit.select_buzzer_eyemin(pi_mid);
END;
$function$
CREATE OR REPLACE FUNCTION audit.select_buzzer_eyemin(pi_mid character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN

    OPEN po_cursor FOR 
SELECT con.b_spd_op1_on, con.i_spd_alert_1, con.b_spd_op2_on, con.i_spd_alert_2 , box.i_pin_code
from config_receiver con
JOIN public.box_profile box ON con.i_mid_id = box.i_mid_id
WHERE box.i_mid_id = CAST(pi_mid AS NUMERIC);

  RETURN po_cursor;
END
$function$

CREATE OR REPLACE FUNCTION audit.update_status_user_detail(pi_mid character varying, pi_user_id character varying, pi_group_id character varying, pi_car_note character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
	po_cursor refcursor;
BEGIN
	UPDATE public.box_profile
	SET i_user_id = 794,
		i_group_id = 353,
		c_car_note = pi_car_note
	WHERE i_mid_id = pi_mid::NUMERIC;

	UPDATE config_receiver               
     SET b_hide_from_dlt = false
    WHERE i_mid_id = CAST(pi_mid AS NUMERIC);
	
  	RETURN audit.select_status_user_detail(pi_group_id, NULL, NULL);
END;
$function$

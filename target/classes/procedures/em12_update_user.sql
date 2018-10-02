CREATE OR REPLACE FUNCTION audit.em12_update_user(pi_mid character varying, pi_group_id character varying, pi_user_id character varying, pi_dtinstall character varying, pi_carcode character varying, pi_platenumber character varying, pi_pic character varying, pi_technician character varying, pi_cartype character varying, pi_carnote character varying, pi_boxnote character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
  v_get_rowcount              NUMERIC;
BEGIN
	UPDATE box_profile 
		SET i_group_id = pi_group_id::NUMERIC
		  , i_user_id = pi_user_id::NUMERIC
		  , dt_install = pi_dtinstall::TIMESTAMP
		  , c_plate_number = pi_platenumber
		  , c_car_code = pi_carcode
		  , i_show_pic = pi_pic::NUMERIC
		  , c_technician = pi_technician
		  , c_car_type = pi_cartype
		  , c_car_note = pi_carnote
		  , c_box_note = pi_boxnote
	WHERE i_mid_id = pi_mid::NUMERIC;

  GET DIAGNOSTICS v_get_rowcount = ROW_COUNT;

  OPEN po_cursor FOR SELECT v_get_rowcount AS CheckColumnUpdate;
  RETURN po_cursor;
END
$function$

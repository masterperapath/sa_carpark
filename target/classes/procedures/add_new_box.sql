create or REPLACE function audit.add_new_box(pi_mid character varying, pi_box_model character varying, pi_imei character varying) returns refcursor
LANGUAGE plpgsql
AS $$
declare
	po_cursor			REFCURSOR;
	v_validate     		NUMERIC(15)  := 0;
	v_validate_mid     	NUMERIC(15)  := 0;
	v_validate_imei     NUMERIC(15)  := 0;
BEGIN
	
	SELECT 1 
	INTO v_validate_mid
	FROM config_receiver
	WHERE i_mid_id = pi_mid::NUMERIC;

	SELECT 1
	INTO v_validate_imei
	FROM config_receiver
	WHERE i_imei = pi_imei::NUMERIC;

	IF (v_validate_mid = 1 OR v_validate_imei = 1) OR (v_validate_mid = 1 AND v_validate_imei = 1 ) THEN
		RAISE EXCEPTION USING ERRCODE = '20900', message = 'MID หรือ IMEI ซ้ำ กรุณากรอกใหม';
	ELSE
		INSERT INTO config_receiver(i_mid_id, b_outbound_dx, b_acc_alway_on, i_imei, i_model, d_mile_multiplier) VALUES (pi_mid::NUMERIC,false,false,pi_imei::NUMERIC,SUBSTRING(pi_box_model FROM 2)::NUMERIC,1.02);
	END IF;

	SELECT 1 
	INTO v_validate
	FROM box_profile
	WHERE i_mid_id = pi_mid::NUMERIC;

	IF v_validate = 1 THEN
		RAISE EXCEPTION USING ERRCODE = '20900', message = 'MID หรือ IMEI ซ้ำ กรุณากรอกใหม';
	ELSE
		INSERT INTO box_profile(i_mid_id, i_user_id, i_group_id, c_plate_number, c_car_type, c_car_model, c_car_brand, c_car_code, c_sim_number_true, c_box_note, c_box_model, i_devour_travel, i_devour_speed_over, i_empty_ad2, i_full_ad2) VALUES (pi_mid::NUMERIC,752,330,'-','-','-','-',pi_mid,'0123456789','TRUE MOVE H',pi_box_model,3.0,2.0,660,4);
	END IF;
	
	SELECT 1 
	INTO v_validate
	FROM gprsserver_out
	WHERE recipient = pi_mid::NUMERIC;

	IF v_validate = 1 THEN
		RAISE EXCEPTION USING ERRCODE = '20900', message = 'MID หรือ IMEI ซ้ำ กรุณากรอกใหม';
	ELSE 
		INSERT INTO gprsserver_out(recipient, message) VALUES (pi_mid::NUMERIC,'C50,1,11,12,13,14,21,22,23,24');
	END IF;
	
	OPEN po_cursor FOR
		SELECT 1 AS success ;
		
	RETURN po_cursor;

END;
$$;

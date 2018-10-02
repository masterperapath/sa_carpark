CREATE OR REPLACE FUNCTION audit.em25_confirm_swap_box_2(pi_mid_target character varying, pi_mid_target_reuse character varying, pi_mid_swap character varying, pi_note_box_target character varying, pi_note_box_swap character varying, pi_username character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
	po_cursor       REFCURSOR;
	v_group_box_out INTEGER := 351;
	v_user_box_out INTEGER := 786;
	v_check_mid INTEGER := 1;
BEGIN
	
	BEGIN
		SELECT 1
		INTO v_check_mid
		FROM config_receiver
		WHERE i_mid_id = pi_mid_target_reuse::NUMERIC;
		
		IF v_check_mid IS NULL THEN
			v_check_mid = 0;
		END IF;
	END;

	IF v_check_mid = 0 THEN
  	--Insert config_receiver of reuse box(6 digit) by data from target box.
	  INSERT INTO config_receiver
	  SELECT pi_mid_target_reuse::NUMERIC AS i_mid_id, b_outbound_dx, b_acc_alway_on, i_imei, i_model, i_min_kill_start
	    , b_outbound_pt, b_outbound_tnf, d_mile_multiplier, b_acc_with_voltage, i_acc_voltage
	    , b_is_skywave, c_imei_skywave, c_license, c_name, i_speed_calculate_station, b_omnicomm_fuel_sensor
	    , b_faker_date, b_outbound_ngmb, b_paker, b_nca, b_spd_op1_on, i_spd_alert_1
	    , b_spd_op2_on, i_spd_alert_2, b_spd_op1_on_m2, i_spd_alert_1_m2, b_outbound_scg
	    , b_mirrorz, b_outbound_schenker, i_imei_to_dlt, note, b_faker_latlng
	    , i_faker_lat, i_faker_lng, b_idle_op1_on, i_idle_alert_1, b_idle_op2_on
	    , i_idle_alert_2, i_mid_to_dlt48, b_dec70to110, b_send_to_dlt, c_doc_no33
	    , b_ip1sos, b_outbound_eoctrack, b_hide_from_dlt, b_outbound_ttet_est
	  FROM config_receiver 
	  WHERE i_mid_id = pi_mid_target::NUMERIC;
	END IF;
	
	BEGIN
		SELECT 1
		INTO v_check_mid
		FROM box_profile
		WHERE i_mid_id = pi_mid_target_reuse::NUMERIC;
		
		IF v_check_mid IS NULL THEN
			v_check_mid = 0;
		END IF;
	END;
	 
	IF v_check_mid = 0 THEN
	--Insert box_profile of reuse box(6 digit) by data from target box.
	 INSERT INTO box_profile(i_mid_id, i_user_id, i_group_id, i_show_pic, c_plate_number,
        c_car_type, c_car_model, c_car_brand, i_car_year, c_car_color,
        i_car_engine, c_car_code, i_driver_id, i_devour_ideal, i_devour_travel,
        c_car_note, i_province_plate, c_vin, c_engine_no, c_insur_com,
        c_policy_no, c_insur_note, i_pin_code, c_caller_id, i_speed_limit,
        b_ip2_active_high, i_word_ip2, c_pic_name, i_empty_ad1, i_full_ad1,
        i_empty_ad2, i_full_ad2, i_devour_speed_over, i_container_volume,
        c_sim_number, c_box_model, c_authorized_phone_number1,
        c_authorized_phone_number2, c_authorized_phone_number3, c_box_note,
        c_serial_box, i_fuel_type, dt_install, dt_updated, dt_carnote_updated,
        c_word_ip1true, c_word_ip1false, c_lot_date, c_word_ip5true,
        c_word_ip5false, i_price, i_payment, c_sale_type, c_credit_type,
        dt_expire, dt_create, d_billing_1st, d_install, i_discount_price,
        c_service_type, i_discount_payment, i_freemonth, b_optfuel, b_opttemp,
        b_optdoor, b_optcigar, b_optgen, b_optswitch, b_optother, i_bfuel, i_btemp,
        i_bdoor, i_bcigar, i_bgen, i_bswitch, i_bother, i_idle_limit, i_box_state,
        taxii_type, c_sim_number_true, c_sim_number_dtac, i_word2_ip2,
        dt_install_for_dlt, dt_upgrade, i_car_weight, i_truck_weight,
        i_regis_type, b_use_equation, d_low_offset, d_high_offset,
        d_equation_var1, d_equation_var2, c_insurance_filename,
        c_word_ip2true, c_word_ip2false, c_word_ip3true, c_word_ip3false,
        c_technician
		)
		SELECT  pi_mid_target_reuse::NUMERIC AS i_mid_id, v_user_box_out, v_group_box_out, i_show_pic, c_plate_number,
        c_car_type, c_car_model, c_car_brand, i_car_year, c_car_color,
        i_car_engine, c_car_code, i_driver_id, i_devour_ideal, i_devour_travel,
        '-', i_province_plate, c_vin, c_engine_no, c_insur_com,
        c_policy_no, c_insur_note, i_pin_code, c_caller_id, i_speed_limit,
        b_ip2_active_high, i_word_ip2, c_pic_name, i_empty_ad1, i_full_ad1,
        i_empty_ad2, i_full_ad2, i_devour_speed_over, i_container_volume,
        c_sim_number, c_box_model, c_authorized_phone_number1,
        c_authorized_phone_number2, c_authorized_phone_number3, '-',
        c_serial_box, i_fuel_type, dt_install, dt_updated, dt_carnote_updated,
        c_word_ip1true, c_word_ip1false, c_lot_date, c_word_ip5true,
        c_word_ip5false, i_price, i_payment, c_sale_type, c_credit_type,
        dt_expire, dt_create, d_billing_1st, d_install, i_discount_price,
        c_service_type, i_discount_payment, i_freemonth, b_optfuel, b_opttemp,
        b_optdoor, b_optcigar, b_optgen, b_optswitch, b_optother, i_bfuel, i_btemp,
        i_bdoor, i_bcigar, i_bgen, i_bswitch, i_bother, i_idle_limit, i_box_state,
        taxii_type, c_sim_number_true, c_sim_number_dtac, i_word2_ip2,
        dt_install_for_dlt, dt_upgrade, i_car_weight, i_truck_weight,
        i_regis_type, b_use_equation, d_low_offset, d_high_offset,
        d_equation_var1, d_equation_var2, c_insurance_filename,
        c_word_ip2true, c_word_ip2false, c_word_ip3true, c_word_ip3false,
        c_technician
		FROM box_profile
		WHERE i_mid_id = pi_mid_target::NUMERIC;
	
	END IF;

	--Update config_receiver of target box for new i_imei and i_model but other config don't update.  
		UPDATE config_receiver
		SET i_imei = new_box.i_imei
		, i_model = new_box.i_model
		FROM (	
			SELECT i_imei, i_model
			FROM config_receiver 
			WHERE i_mid_id = pi_mid_swap::NUMERIC
			  ) new_box
		WHERE i_mid_id = pi_mid_target::NUMERIC;
		   
	--Delete config_receiver of swap box because used.
		DELETE FROM config_receiver
        WHERE i_mid_id = pi_mid_swap::NUMERIC;
       
    --Update note box_profile for target box.
        UPDATE box_profile 
        SET c_box_note = pi_note_box_target 
        WHERE i_mid_id = pi_mid_target::NUMERIC;
     
     --Update note box_profile for swap box.
        UPDATE box_profile 
        SET c_box_note = pi_note_box_swap 
        WHERE i_mid_id = pi_mid_swap::NUMERIC;
       
        UPDATE box_profile 
        SET i_user_id=v_user_box_out,
        	i_group_id=v_group_box_out
        WHERE i_mid_id = pi_mid_swap::NUMERIC;
       
       	INSERT INTO audit.history_swap_box_2
       	(sb_mid_cuurent, sb_imei_cuurent, sb_mid_target, sb_imei_target, sb_mid_swap
		, sb_imei_swap, sb_mid_target_reuse, sb_imei_target_reuse, create_name, create_date
		, update_name, update_date)
        SELECT target.i_mid_id AS sb_mid_cuurent , target.i_imei AS sb_imei_cuurent
        , target.i_mid_id AS sb_mid_target, reuse.i_imei AS sb_imei_target 
        , pi_mid_swap::NUMERIC AS sb_mid_swap, target.i_imei AS sb_imei_swap
        , reuse.i_mid_id AS sb_mid_target_reuse, reuse.i_imei AS sb_imei_target_reuse
        , pi_username, now(), pi_username, now()
        FROM config_receiver target,  config_receiver reuse 
        WHERE target.i_mid_id = pi_mid_target::NUMERIC
            AND reuse.i_mid_id = pi_mid_target_reuse::NUMERIC;


  	RETURN audit.em25_select_imei_by_mid(pi_mid_target);
  	
END
$function$

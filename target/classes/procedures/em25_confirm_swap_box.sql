create or REPLACE function audit.em25_confirm_swap_box(pi_mid_lost character varying, pi_mid_store character varying, pi_mid_new character varying, pi_note_new character varying, pi_note_lost character varying) returns refcursor
LANGUAGE plpgsql
AS $$
DECLARE
	po_cursor                 REFCURSOR;
	v_validate  				 VARCHAR;
BEGIN

	v_validate := '1';
	INSERT INTO config_receiver
		  SELECT pi_mid_store::NUMERIC AS i_mid_id, b_outbound_dx, b_acc_alway_on, i_imei, i_model, i_min_kill_start
		    , b_outbound_pt, b_outbound_tnf, d_mile_multiplier, b_acc_with_voltage, i_acc_voltage
		    , b_is_skywave, c_imei_skywave, c_license, c_name, i_speed_calculate_station, b_omnicomm_fuel_sensor
		    , b_faker_date, b_outbound_ngmb, b_paker, b_nca, b_spd_op1_on, i_spd_alert_1
		    , b_spd_op2_on, i_spd_alert_2, b_spd_op1_on_m2, i_spd_alert_1_m2, b_outbound_scg
		    , b_mirrorz, b_outbound_schenker, i_imei_to_dlt, note, b_faker_latlng
		    , i_faker_lat, i_faker_lng, b_idle_op1_on, i_idle_alert_1, b_idle_op2_on
		    , i_idle_alert_2, i_mid_to_dlt48, b_dec70to110, b_send_to_dlt, c_doc_no33
		    , b_ip1sos, b_outbound_eoctrack, b_hide_from_dlt, b_outbound_ttet_est
		  FROM config_receiver 
		  WHERE i_mid_id = pi_mid_lost::NUMERIC;

	v_validate := '2';
	INSERT INTO box_profile(
				i_mid_id, i_user_id, i_group_id, i_show_pic, c_plate_number,
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
        c_technician, "nameIma", photo, idima
	)
		  SELECT  pi_mid_store::NUMERIC AS i_mid_id, 786, 351, i_show_pic, c_plate_number,
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
        c_technician, "nameIma", photo, idima
		  FROM box_profile
		  WHERE i_mid_id = pi_mid_lost::NUMERIC;
		  
	v_validate := '3';
	UPDATE config_receiver
		SET b_outbound_dx = new_box.b_outbound_dx, 
			b_acc_alway_on = new_box.b_acc_alway_on,
			i_imei = new_box.i_imei,
			i_model = new_box.i_model,
			i_min_kill_start = new_box.i_min_kill_start,
			b_outbound_pt = new_box.b_outbound_pt,
			b_outbound_tnf = new_box.b_outbound_tnf,
			d_mile_multiplier = new_box.d_mile_multiplier,
			b_acc_with_voltage = new_box.b_acc_with_voltage,
			i_acc_voltage = new_box.i_acc_voltage,
			b_is_skywave = new_box.b_is_skywave,
			c_imei_skywave = new_box.c_imei_skywave,
			c_license = new_box.c_license,
			c_name = new_box.c_name,
			i_speed_calculate_station = new_box.i_speed_calculate_station,
			b_omnicomm_fuel_sensor = new_box.b_omnicomm_fuel_sensor,
			b_faker_date = new_box.b_faker_date,
			b_outbound_ngmb = new_box.b_outbound_ngmb,
			b_paker = new_box.b_paker,
			b_nca = new_box.b_nca,
			b_spd_op1_on = new_box.b_spd_op1_on,
			i_spd_alert_1 = new_box.i_spd_alert_1,
			b_spd_op2_on = new_box.b_spd_op2_on,
			i_spd_alert_2 = new_box.i_spd_alert_2,
			b_spd_op1_on_m2 = new_box.b_spd_op1_on_m2,
			i_spd_alert_1_m2 = new_box.i_spd_alert_1_m2,
			b_outbound_scg = new_box.b_outbound_scg,
			b_mirrorz = new_box.b_mirrorz,
			b_outbound_schenker = new_box.b_outbound_schenker,
			i_imei_to_dlt = new_box.i_imei_to_dlt,
			note = new_box.note,
			b_faker_latlng = new_box.b_faker_latlng,
			i_faker_lat = new_box.i_faker_lat,
			i_faker_lng = new_box.i_faker_lng,
			b_idle_op1_on = new_box.b_idle_op1_on,
			i_idle_alert_1 = new_box.i_idle_alert_1,
			b_idle_op2_on = new_box.b_idle_op2_on,
			i_idle_alert_2 = new_box.i_idle_alert_2,
			i_mid_to_dlt48 = new_box.i_mid_to_dlt48,
			b_dec70to110 = new_box.b_dec70to110,
			b_send_to_dlt = new_box.b_send_to_dlt,
			c_doc_no33 = new_box.c_doc_no33,
			b_ip1sos = new_box.b_ip1sos,
			b_outbound_eoctrack = new_box.b_outbound_eoctrack,
			b_hide_from_dlt = new_box.b_hide_from_dlt,
			b_outbound_ttet_est = new_box.b_outbound_ttet_est
		FROM (
		    SELECT b_outbound_dx, b_acc_alway_on, i_imei, i_model, i_min_kill_start
		    , b_outbound_pt, b_outbound_tnf, d_mile_multiplier, b_acc_with_voltage, i_acc_voltage
		    , b_is_skywave, c_imei_skywave, c_license, c_name, i_speed_calculate_station, b_omnicomm_fuel_sensor
		    , b_faker_date, b_outbound_ngmb, b_paker, b_nca, b_spd_op1_on, i_spd_alert_1
		    , b_spd_op2_on, i_spd_alert_2, b_spd_op1_on_m2, i_spd_alert_1_m2, b_outbound_scg
		    , b_mirrorz, b_outbound_schenker, i_imei_to_dlt, note, b_faker_latlng
		    , i_faker_lat, i_faker_lng, b_idle_op1_on, i_idle_alert_1, b_idle_op2_on
		    , i_idle_alert_2, i_mid_to_dlt48, b_dec70to110, b_send_to_dlt, c_doc_no33
		    , b_ip1sos, b_outbound_eoctrack, b_hide_from_dlt, b_outbound_ttet_est
		  FROM config_receiver 
		  WHERE i_mid_id = pi_mid_new::NUMERIC
		  ) new_box
		WHERE 
		    i_mid_id = pi_mid_lost::NUMERIC;
		 
		v_validate := '4';
		DELETE FROM config_receiver
        WHERE i_mid_id = pi_mid_new::NUMERIC;
        
        v_validate := '5';
        UPDATE box_profile 
        SET c_box_note = pi_note_lost 
        WHERE i_mid_id = pi_mid_lost::NUMERIC;
        
        v_validate := '6';
        UPDATE box_profile 
        SET c_box_note = pi_note_new 
        WHERE i_mid_id = pi_mid_new::NUMERIC;
        
        v_validate := '7';
        UPDATE box_profile 
        SET i_user_id=786, 
        		i_group_id=351 
        WHERE i_mid_id = pi_mid_new::NUMERIC;

				v_validate := '8';
				INSERT INTO audit.history_swap_box
          SELECT NEXTVAL('audit.his_chg_id_seq'::REGCLASS), lost.i_mid_id, lost.i_imei, store.i_mid_id, store.i_imei, pi_mid_new::NUMERIC
          FROM config_receiver lost
            JOIN config_receiver store ON 1=1
          WHERE lost.i_mid_id = pi_mid_lost::NUMERIC
            AND store.i_mid_id = pi_mid_store::NUMERIC;

  	RETURN audit.em25_select_imei_by_mid(pi_mid_lost);
  	
  	EXCEPTION WHEN OTHERS THEN
  	 OPEN po_cursor FOR
  		SELECT v_validate;
  	 RETURN po_cursor;
END
$$;

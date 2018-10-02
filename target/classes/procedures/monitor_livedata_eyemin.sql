CREATE OR REPLACE FUNCTION audit.monitor_livedata_eyemin(pi_group_name character varying, pi_plate_number character varying, pi_car_code character varying, pi_car_type character varying, pi_mid character varying, pi_uservin character varying, pi_senddata character varying, pi_imei character varying, pi_imei_vms character varying, pi_comment character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_sql                       VARCHAR(32000);
  po_cursor                   REFCURSOR;
BEGIN
  v_sql := '
    WITH params_table AS (
      SELECT $1 AS group_name,
             $2 AS plate_number,
             $3 AS car_code,
             $4 AS car_type,
             $5 AS mid,
             $6 AS uservin,
			 $7 AS senddata,
			 $8 AS imei,
			 $9 AS imeivms,
			 $10 AS ccomment
    )
    SELECT  ROW_NUMBER() OVER() AS No ,eyemin.i_mid_id, eyemin.status1, eyemin.status2, eyemin.status3,
	 			 eyemin.b_overdue_fees, eyemin.i_subgrp_id, eyemin.enabled, eyemin.b_hide_from_dlt, eyemin.c_group_name, eyemin.c_plate_number, eyemin.c_car_code,
	 			 eyemin.c_car_type, eyemin.ts_gprsdate, eyemin.i_ext_power_voltage, eyemin.i_speed, eyemin.position,
	 			 eyemin.i_card, eyemin.ts_keepalive, eyemin.c_user_vin, eyemin.c_comment, eyemin.dt_install,
	 			 eyemin.c_box_note, eyemin.c_technician, eyemin.c_driver_name, eyemin.c_mobile_num
    FROM (
      SELECT  box.i_mid_id
             ,CASE
				WHEN (
					CASE
						WHEN 14000 <= live.i_mid_id AND live.i_mid_id <= 15000 THEN (
							CASE
								WHEN (EXTRACT(epoch FROM (now() - ts_keepalive)) > 5400 ) THEN true
								ELSE false
							END
						)
						ELSE (
							CASE
								WHEN (EXTRACT(epoch FROM (now() - ts_keepalive)) > 3600 ) THEN true
								ELSE false
							END
						)
					END
				) THEN 6
                WHEN c_gps_valid = ''L'' OR c_gps_valid = ''V'' OR i_speed > 200 THEN 7
                WHEN i_speed <= 2 AND b_ip2_acc IS TRUE THEN 1
                WHEN i_speed <= box.i_speed_limit AND b_ip2_acc IS TRUE THEN 2
                WHEN i_speed > box.i_speed_limit AND b_ip2_acc IS TRUE THEN 3
                WHEN i_speed <= 9999 AND b_ip2_acc IS FALSE THEN 4
                ELSE 0
              END AS status1
            ,CASE
 			    WHEN ts_ext_power_on < ts_power_cut
                THEN (
 				   CASE
 				     WHEN ((i_ext_power_voltage < 900) AND (EXTRACT(DAY FROM (ts_gpsdate - ts_power_cut)) < 3)) THEN ''ไฟ''
   				     ELSE ''''
   				   END
 				)
 				ELSE (
              		CASE i_word_ip2
              		WHEN 0 THEN (
						CASE WHEN  b_ip5_input THEN ''test mode''
              			  WHEN b_ip4_shock THEN ''test mode''
              			  WHEN b_ip3 THEN ''test mode''
              			  WHEN b_ip2_acc THEN ''test mode''
              			  WHEN b_ip1_door THEN ''test mode''
            			  ELSE ''''
            			END
						)
              		WHEN 1 THEN (CASE WHEN b_ip1_door THEN ''เปิด'' ELSE ''-'' END)
              		WHEN 2 THEN (CASE WHEN b_ip1_door THEN ''มีคน'' ELSE ''ว่าง'' END)
              		WHEN 3 THEN (CASE WHEN b_ip2_acc THEN (CASE WHEN b_ip1_door THEN ''ว่าง'' ELSE ''มีคน'' END) ELSE ''ว่าง'' END)
              		WHEN 4 THEN (CASE WHEN b_ip1_door THEN ''เสีย''
                                	  WHEN b_ip4_shock THEN ''พัก''
                                	  WHEN b_ip3 THEN ''รอ''
                            		  ELSE ''-''
                              	END)
              		WHEN 5 THEN (CASE WHEN b_ip5_input THEN ''-'' ELSE ''เปิด'' END)
              		WHEN 6 THEN (CASE WHEN b_ip5_input THEN ''เปิด'' ELSE ''-'' END)
              		WHEN 7 THEN (CASE WHEN b_ip1_door THEN ''เสีย''
                                	  WHEN b_ip4_shock THEN ''รอ''
                                	  WHEN b_ip3 THEN ''พัก''
                            	  	  ELSE ''-''
                            	END )
              		WHEN 8 THEN (CASE WHEN b_ip1_door THEN ''-'' ELSE ''เปิด'' END)
              		WHEN 9 THEN (CASE WHEN b_ip4_shock THEN ''-'' ELSE ''เปิด'' END)
              		WHEN 10 THEN (CASE WHEN b_ip4_shock THEN ''เปิด'' ELSE ''-'' END)
					WHEN 11 THEN(CASE WHEN NOT b_ip2_acc AND i_speed >= 10 THEN ''กุญแจ'' ELSE (CASE WHEN b_ip1_door THEN ''เปิด'' ELSE ''-'' END)END)
            		ELSE ''''
            		END)
 			  END AS status2
         ,CASE
 			    WHEN ts_ext_power_on < ts_power_cut
                THEN (
 				   CASE
 				     WHEN ((i_ext_power_voltage < 900) AND (EXTRACT(DAY FROM (ts_gpsdate - ts_power_cut)) < 3)) THEN ''ไฟ''
   				     ELSE ''''
   				   END
 				)
 				ELSE (
              		CASE i_word2_ip2
              		WHEN 0 THEN (
						CASE WHEN  b_ip5_input THEN ''test mode''
              			  WHEN b_ip4_shock THEN ''test mode''
              			  WHEN b_ip3 THEN ''test mode''
              			  WHEN b_ip2_acc THEN ''test mode''
              			  WHEN b_ip1_door THEN ''test mode''
            			  ELSE ''''
            			END
						)
              		WHEN 1 THEN (CASE WHEN b_ip1_door THEN ''เปิด'' ELSE ''-'' END)
              		WHEN 2 THEN (CASE WHEN b_ip1_door THEN ''มีคน'' ELSE ''ว่าง'' END)
              		WHEN 3 THEN (CASE WHEN b_ip2_acc THEN (CASE WHEN b_ip1_door THEN ''ว่าง'' ELSE ''มีคน'' END) ELSE ''ว่าง'' END)
              		WHEN 4 THEN (CASE WHEN b_ip1_door THEN ''เสีย''
                                	  WHEN b_ip4_shock THEN ''พัก''
                                	  WHEN b_ip3 THEN ''รอ''
                            		  ELSE ''-''
                              	END)
              		WHEN 5 THEN (CASE WHEN b_ip5_input THEN ''-'' ELSE ''เปิด'' END)
              		WHEN 6 THEN (CASE WHEN b_ip5_input THEN ''เปิด'' ELSE ''-'' END)
              		WHEN 7 THEN (CASE WHEN b_ip1_door THEN ''เสีย''
                                	  WHEN b_ip4_shock THEN ''รอ''
                                	  WHEN b_ip3 THEN ''พัก''
                            	  	  ELSE ''-''
                            	END )
              		WHEN 8 THEN (CASE WHEN b_ip1_door THEN ''-'' ELSE ''เปิด'' END)
              		WHEN 9 THEN (CASE WHEN b_ip4_shock THEN ''-'' ELSE ''เปิด'' END)
              		WHEN 10 THEN (CASE WHEN b_ip4_shock THEN ''เปิด'' ELSE ''-'' END)
            		ELSE ''''
            		END)
 			  END AS status3
			, CASE WHEN usr.b_overdue_fees IS TRUE THEN ''ค้างชำระ''  ELSE ''ปกติ'' END AS b_overdue_fees
            , CASE WHEN i_subgrp_id = 0 THEN ''หลัก''  ELSE ''ย่อย''  END AS i_subgrp_id
			, CASE WHEN usr.enabled IS TRUE THEN ''เปิด''  ELSE ''ปิด'' END AS enabled
			, CASE WHEN con.b_hide_from_dlt IS TRUE THEN ''ไม่ส่ง''  WHEN con.b_hide_from_dlt IS FALSE THEN ''ส่ง'' ELSE ''-''  END AS b_hide_from_dlt
            , grp.c_group_name AS c_group_name ,box.c_plate_number AS c_plate_number
            , box.c_car_code AS c_car_code ,box.c_car_type AS c_car_type ,COALESCE(TO_CHAR(ts_gprsdate, ''DD/MM/YYYY HH24:MI:SS''),''-'')  AS ts_gprsdate
            , COALESCE(ROUND(i_ext_power_voltage / 100.00,2)::VARCHAR,''0'') AS i_ext_power_voltage ,COALESCE(i_speed::VARCHAR,''-'') AS i_speed
            , CONCAT(tum.tambon_t, '' '', amp.amphur_t, '' '', pro.province_t ,'' ( '', ROUND(live.i_latitude / 1000000.0::NUMERIC,6)  ,'','', ROUND(live.i_longitude / 1000000.0::NUMERIC,6) ,'' )'') AS position
            , COALESCE(i_card::VARCHAR,''-'') AS i_card , COALESCE(TO_CHAR(now() - ts_keepalive, ''DD,HH24:MI:SS''),''-'') AS ts_keepalive
            , CONCAT(COALESCE(dlt.c_user_vin, ''-''),''/'',COALESCE(con.c_imei_skywave, ''-'')) AS c_user_vin
            , COALESCE(grp.c_comment,''-'')  AS c_comment
            , COALESCE(TO_CHAR(box.dt_install, ''DD/MM/YYYY''),''-'') AS dt_install
			, box.c_box_note AS c_box_note 
			, COALESCE(box.c_technician,''-'')  AS c_technician
			, ''-''  AS c_driver_name
			, ''-''  AS c_mobile_num
      FROM public.box_profile  box
        LEFT JOIN public.livedata live ON box.i_mid_id = live.i_mid_id
		LEFT JOIN public.config_receiver con ON con.i_mid_id = box.i_mid_id
        LEFT JOIN public.group_profile grp ON grp.i_group_id = box.i_group_id
        LEFT JOIN public.tumbon tum ON tum.gid = live.i_tambon
        LEFT JOIN public.amphur amp ON amp.gid = live.i_amphur
        LEFT JOIN public.province pro ON pro.gid = live.i_province
        LEFT JOIN public.dlt_regis_info dlt ON dlt.i_mid_id = live.i_mid_id
		LEFT JOIN public.user_profile usr ON usr.i_user_id = box.i_user_id            
        JOIN params_table prm ON 1 = 1
      WHERE box.i_mid_id <= 888000
  ';

  IF pi_group_name IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(grp.c_group_name)' || ' LIKE ''%'' || LOWER(prm.group_name) || ''%''';
  END IF;

  IF pi_plate_number IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(box.c_plate_number)' || ' LIKE ''%'' || LOWER(prm.plate_number) || ''%''';
  END IF;

  IF pi_car_code IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(box.c_car_code)' || ' LIKE ''%'' || LOWER(prm.car_code) || ''%''';
  END IF;

  IF pi_car_type IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(box.c_car_type)' || ' LIKE ''%'' || LOWER(prm.car_type) || ''%''';
  END IF;

  IF pi_mid IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'box.i_mid_id::VARCHAR' || ' LIKE ''%'' || prm.mid || ''%'' ';
  END IF;

  IF pi_uservin IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'LOWER(dlt.c_user_vin)' || ' LIKE ''%'' || LOWER(prm.uservin) || ''%''';
  END IF;
  
  IF pi_senddata IS NOT NULL THEN
    v_sql := v_sql || 'AND con.'|| pi_senddata ||' = TRUE ';
  END IF;
  
  IF pi_imei IS NOT NULL THEN
    v_sql := v_sql || 'AND con.i_imei = prm.imei::NUMERIC ';
  END IF;
  
  IF pi_imei_vms IS NOT NULL THEN
    v_sql := v_sql || 'AND con.c_imei_skywave = prm.imeivms ';
  END IF;
  
   IF pi_comment IS NOT NULL THEN
     v_sql := v_sql || 'AND ' || 'LOWER(grp.c_comment)' || ' LIKE ''%'' || LOWER(prm.ccomment) || ''%''';
  END IF;

  v_sql := v_sql || '
           ORDER BY grp.c_group_name , live.i_mid_id
      ';
  IF pi_group_name IS NULL AND pi_plate_number IS NULL AND pi_car_code IS NULL AND pi_car_code IS NULL AND pi_mid IS NULL AND pi_uservin IS NULL AND pi_senddata IS NULL AND pi_imei IS NULL AND pi_imei_vms IS NULL AND pi_comment IS NULL THEN
    v_sql := v_sql || ' LIMIT 100 ';
  END IF;

  v_sql := v_sql || '
        )eyemin
      ';

  OPEN po_cursor FOR EXECUTE v_sql
        USING pi_group_name
            , pi_plate_number
            , pi_car_code
            , pi_car_type
            , pi_mid
            , pi_uservin
            , pi_senddata
            , pi_imei
            , pi_imei_vms
            , pi_comment;
  RETURN po_cursor;
END
$function$

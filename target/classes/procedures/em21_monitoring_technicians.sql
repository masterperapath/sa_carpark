CREATE OR REPLACE FUNCTION audit.em21_monitoring_technicians(pi_mid character varying, pi_imei character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_sql                       VARCHAR(32000);
  po_cursor                   REFCURSOR;
BEGIN
  v_sql := '
    WITH params_table AS (
      SELECT $1 AS mid,
             $2 AS imei
    )
    SELECT  ROW_NUMBER() OVER() AS No ,eyemin.i_mid_id, eyemin.status1, eyemin.status2
                                      , eyemin.status3, eyemin.ts_gprsdate, eyemin.ts_keepalive
                                      , eyemin.i_ext_power_voltage, eyemin.position,eyemin.i_card
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
            , COALESCE(TO_CHAR(ts_gprsdate, ''DD/MM/YYYY HH24:MI:SS''),''-'')  AS ts_gprsdate
            , COALESCE(TO_CHAR(now() - ts_keepalive, ''DD,HH24:MI:SS''),''-'') AS ts_keepalive
            , CONCAT(tum.tambon_t, '' '', amp.amphur_t, '' '', pro.province_t ,'' ( '', ROUND(live.i_latitude / 1000000.0::NUMERIC,6)  ,'','', ROUND(live.i_longitude / 1000000.0::NUMERIC,6) ,'' )'') AS position
            , COALESCE(ROUND((i_ext_power_voltage / 100.00),2)::VARCHAR,''0'') AS i_ext_power_voltage
            , COALESCE(i_card::VARCHAR,''-'') AS i_card
      FROM public.box_profile  box
        LEFT JOIN public.livedata live ON box.i_mid_id = live.i_mid_id
		LEFT JOIN public.config_receiver con ON con.i_mid_id = live.i_mid_id
        LEFT JOIN public.tumbon tum ON tum.gid = live.i_tambon
        LEFT JOIN public.amphur amp ON amp.gid = live.i_amphur
        LEFT JOIN public.province pro ON pro.gid = live.i_province
        LEFT JOIN public.dlt_regis_info dlt ON dlt.i_mid_id = live.i_mid_id         
        JOIN params_table prm ON 1 = 1
      WHERE box.i_mid_id <= 888000
  ';

  IF pi_mid IS NOT NULL THEN
    v_sql := v_sql || 'AND ' || 'box.i_mid_id::VARCHAR' || ' LIKE ''%'' || prm.mid || ''%'' ';
  END IF;

  IF pi_imei IS NOT NULL THEN
    v_sql := v_sql || 'AND con.i_imei = prm.imei::NUMERIC ';
  END IF;
  
  v_sql := v_sql || '
           ORDER BY live.i_mid_id
      ';
      
  IF pi_mid IS NULL AND pi_imei IS NULL THEN
    v_sql := v_sql || ' LIMIT 100 ';
  END IF;

  v_sql := v_sql || '
        )eyemin
      ';

  OPEN po_cursor FOR EXECUTE v_sql
        USING pi_mid
            , pi_imei;
  RETURN po_cursor;
END
$function$

CREATE OR REPLACE FUNCTION audit.em29_update_setup_box(pi_mid character varying, pi_cre_prm_no character varying, pi_entry_code character varying, pi_value character varying, pi_value_complete character varying, pi_user_name character varying)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_get_rowcount     		  NUMERIC;
BEGIN 
	
	IF pi_entry_code = 'B99' THEN
		
		INSERT INTO gprsserver_out (recipient,message)
	      SELECT pi_mid::NUMERIC AS recipient, 'B99'||',CALL,'||value||',2,72' AS message
	      FROM(
		      SELECT regexp_split_to_table(val.VAL1||','||val.VAL2||','||val.VAL3,',') AS value
		      FROM(
			      SELECT CASE WHEN a[1] = '' THEN '0' ELSE '1' END AS VAL1
			      		 , CASE WHEN a[2] = '' THEN '0' ELSE '2' END AS VAL2
			      		 , CASE WHEN a[3] = '' THEN '0' ELSE '3' END AS VAL3
				  FROM (
		    			 SELECT regexp_split_to_array(c_cre_value,',') AS message
			      		 FROM config_receiver_expansion
			             WHERE i_mid_id = pi_mid::NUMERIC
			             AND c_cre_entry_code LIKE 'A71'
				  ) AS dt(a)
			 ) AS val
		  ) AS value
		  WHERE value::NUMERIC != 0;
		  
		  UPDATE config_receiver_expansion
			SET   c_cre_gprsout_referent_id = cf.c_cre_gprsout_referent_id
				, dt_update_date = now()
				, c_update_user = pi_user_name
			FROM(	
			  SELECT max(id) AS c_cre_gprsout_referent_id
			  FROM gprsserver_out WHERE recipient = pi_mid::NUMERIC ) cf
			WHERE i_mid_id = pi_mid::NUMERIC
			AND c_cre_entry_code LIKE pi_entry_code;
			
		GET DIAGNOSTICS v_get_rowcount = ROW_COUNT;
		
		IF v_get_rowcount = 0:: NUMERIC THEN
			
			INSERT INTO config_receiver_expansion
			  SELECT pi_mid::NUMERIC AS i_mid_id, 1 AS i_cre_prm_no, pi_entry_code AS c_cre_entry_code, NULL AS c_cre_value, max(id) AS c_cre_gprsout_referent_id, now() AS dt_create_date
			  		, pi_user_name AS c_create_user, now() AS dt_update_date, pi_user_name AS c_update_user
			  FROM gprsserver_out WHERE recipient = pi_mid::NUMERIC;
			
		END IF;
	
	ELSE
	
		INSERT INTO gprsserver_out (recipient, message)
		VALUES (pi_mid::NUMERIC, pi_value_complete);
		
		UPDATE config_receiver_expansion
			SET   c_cre_value = pi_value
				, c_cre_gprsout_referent_id = cf.c_cre_gprsout_referent_id
				, dt_update_date = now()
				, c_update_user = pi_user_name
			FROM(	
			  SELECT max(id) AS c_cre_gprsout_referent_id
			  FROM gprsserver_out WHERE recipient = pi_mid::NUMERIC ) cf
			WHERE i_mid_id = pi_mid::NUMERIC
			AND c_cre_entry_code LIKE pi_entry_code;
			
		GET DIAGNOSTICS v_get_rowcount = ROW_COUNT;
		
		IF v_get_rowcount = 0:: NUMERIC THEN
			
			INSERT INTO config_receiver_expansion
			  SELECT pi_mid::NUMERIC AS i_mid_id, 1 AS i_cre_prm_no, pi_entry_code AS c_cre_entry_code, pi_value AS c_cre_value, max(id) AS c_cre_gprsout_referent_id, now() AS dt_create_date
			  		, pi_user_name AS c_create_user, now() AS dt_update_date, pi_user_name AS c_update_user
			  FROM gprsserver_out WHERE recipient = pi_mid::NUMERIC;
			
		END IF;
		
	END IF;	

    RETURN audit.em29_select_setup_box(pi_mid,pi_entry_code);
END
$function$
CREATE OR REPLACE FUNCTION audit.update_status_user_header(pi_mid character varying, pi_userid character varying, pi_groupid character varying, pi_statusmassage_user boolean, pi_status_user boolean, pi_suspend_user boolean)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
	po_cursor 		refcursor;
	v_groupname 		VARCHAR;
BEGIN
     UPDATE user_profile          
     SET b_overdue_fees = pi_status_user , 
     enabled = pi_suspend_user ,
     b_show_msg2user = pi_statusmassage_user ,
     c_msg2user = msg.c_prmd_value_1
     from(
     SELECT c_prmd_value_1
  	 FROM parameter_detail
  	 WHERE i_prmh_no = 3 
  	 AND c_prmd_entry_code = 'MSG01'
     )msg
     WHERE i_user_id = pi_userid :: NUMERIC;

     UPDATE config_receiver            
     SET b_hide_from_dlt  = FALSE
  	 WHERE i_mid_id IN (
  	 	SELECT i_mid_id
  	 	FROM box_profile 
  	 	WHERE i_group_id = pi_groupid :: NUMERIC
  	 );

  	 SELECT c_group_name
  	 INTO v_groupname
  	 FROM group_profile
  	 WHERE i_group_id = pi_groupid::NUMERIC;
       	 
  	RETURN audit.select_status_user_header(pi_groupid, v_groupname, pi_mid);
END;
$function$

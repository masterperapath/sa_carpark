create function audit.em26_update_payment_subgroup(pi_mid character varying, pi_userid character varying, pi_groupid character varying, pi_status_user boolean, pi_suspend_user boolean) returns refcursor
LANGUAGE plpgsql
AS $$
DECLARE
	po_cursor 		refcursor;
	v_groupname 		VARCHAR;
BEGIN
    UPDATE user_profile          
     SET b_overdue_fees = pi_status_user , 
     enabled = pi_suspend_user
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
       	 
  	RETURN audit.em26_select_payment_subgroup(pi_groupid, v_groupname, pi_mid);
END;
$$;

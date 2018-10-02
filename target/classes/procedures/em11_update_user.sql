CREATE OR REPLACE FUNCTION audit.em11_update_user(pi_userid character varying, pi_user_name character varying, pi_groupid character varying, pi_authority character varying, pi_subgroup boolean)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
	v_group_name 	  VARCHAR(50);
	v_sub_group_id	  		  NUMERIC;
	v_sub_group_id_check	  NUMERIC;
BEGIN
	IF pi_subgroup = TRUE THEN
	
		SELECT i_subgrp_id 
		INTO v_sub_group_id_check
		FROM user_profile 
		WHERE i_user_id = pi_userId::NUMERIC;
		
		IF v_sub_group_id_check = 0 THEN 
			v_sub_group_id := NEXTVAL('audit.subgroupidrelate_seq');
			
		ELSE
			v_sub_group_id := v_sub_group_id_check;
		END IF;
			
	ELSE
		v_sub_group_id := 0;
	END if;
	
	UPDATE user_profile
	SET authority = pi_authority
	  , i_subgrp_id = v_sub_group_id
	WHERE i_user_id = pi_userId::NUMERIC;

	SELECT c_group_name
	INTO v_group_name
	FROM group_profile
	WHERE i_group_id = pi_groupid::NUMERIC;

  	RETURN audit.em11_select_user(v_group_name,NULL);

END;
$function$

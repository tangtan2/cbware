/****** Object:  Table [dbo].[users]    Script Date: 2021-03-28 10:43:45 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[users](
	[id] [uniqueidentifier] NOT NULL,
	[name] [varchar](250) NOT NULL,
	[user_role] [varchar](50) NOT NULL,
	[username] [varchar](100) NOT NULL,
	[email] [varchar](250) NOT NULL,
	[verified] [datetime] NULL,
	[verifier_user_id] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ__users__username] UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[users] ADD  DEFAULT (newid()) FOR [id]
GO

ALTER TABLE [dbo].[users]  WITH CHECK ADD  CONSTRAINT [fk_users_user_roles__user_role_id_id] FOREIGN KEY([user_role])
REFERENCES [dbo].[user_roles] ([name])
GO

ALTER TABLE [dbo].[users] CHECK CONSTRAINT [fk_users_user_roles__user_role_id_id]
GO

ALTER TABLE [dbo].[users]  WITH CHECK ADD  CONSTRAINT [FK_users_users__verifier_user_id_id] FOREIGN KEY([verifier_user_id])
REFERENCES [dbo].[users] ([id])
GO

ALTER TABLE [dbo].[users] CHECK CONSTRAINT [FK_users_users__verifier_user_id_id]
GO


